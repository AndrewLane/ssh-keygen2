const fs = require("fs");
const tmpDir = require("os").tmpdir();
const path = require("path");
const crypto = require("crypto");
const { expect } = require("chai");
const { describe, it, afterEach } = require("mocha");
const sinon = require("sinon");
const childProcess = require("child_process");
const { EventEmitter } = require("events");
const keygen = require("..");

const isMacOs = process.platform === "darwin";
console.log("isMacOs", isMacOs);

describe("basic tests", () => {
  it.only("generates", (done) => {
    keygen((err, result) => {
      console.log("result of generates", JSON.stringify(result, 2, null));
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----\n/);
      expect(result.public).to.match(isMacOs ? /^ssh-ed25519 / : /^ssh-rsa /);
      expect(result.fingerprint.length > 0);
      expect(result.randomart.length > 0);
      done();
    });
  });

  it("encrypts using password", (done) => {
    keygen({ password: "blahblahblah" }, (err, result) => {
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----\n/);
      expect(result.private).to.match(/Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC/);
      expect(result.public).to.match(/^ssh-rsa /);
      expect(result.fingerprint.length > 0);
      expect(result.randomart.length > 0);
      done();
    });
  });

  it("encrypts using passphrase", (done) => {
    keygen({ passphrase: "foo bar biz bat" }, (err, result) => {
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----\n/);
      expect(result.private).to.match(/Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC/);
      expect(result.public).to.match(/^ssh-rsa /);
      expect(result.fingerprint.length > 0);
      expect(result.randomart.length > 0);
      done();
    });
  });

  it("fails with negative number of bits", (done) => {
    keygen({ bits: -1 }, (err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Bits has bad value/);
      done();
    });
  });

  it("fails with too large number of bits", (done) => {
    keygen({ bits: 1000000000 }, (err, result) => {
      if (result) {
        console.log("passed unexpectedly");
        console.log(result.public);
        console.log(result.randomart);
        console.log(result.private);
        console.log(result.fingerprint);
      }
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/(Bits has bad value)|(Invalid RSA key length)/);
      done();
    });
  });

  it("fails with invalid key type", (done) => {
    keygen({ type: "foo" }, (err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/unknown key type/);
      done();
    });
  });

  ["dsa", "ecdsa", "ed25519", "rsa"].forEach((keyType) => {
    it(`can generate a ${keyType} key`, (done) => {
      keygen({ type: keyType }, (err, result) => {
        expect(expect(err).to.be.null);
        expect(result.private).to.match(/^-----BEGIN (.*) PRIVATE KEY-----\n/);
        expect(result.public.length > 0);
        expect(result.fingerprint.length > 0);
        expect(result.randomart.length > 0);
        done();
      });
    });
  });

  it("keeps the file when asked to", (done) => {
    const dummyLocation = path.join(tmpDir, `dummy_file_to_keep_${crypto.randomBytes(16).toString("hex")}`);

    keygen({ keep: true, location: dummyLocation }, (err, result) => {
      expect(expect(err).to.be.null);
      expect(expect(result.path).to.not.be.null);
      const privateKey = result.private;
      fs.readFile(result.path, { encoding: "ascii" }, (fileReadErr, key) => {
        expect(expect(fileReadErr).to.be.null);
        expect(key).to.match(/^-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----\n/);
        expect(key).to.eql(privateKey);
        done();
      });
    });
  });

  it("discards the file when asked to", (done) => {
    const dummyLocation = path.join(tmpDir, `dummy_file_to_discard_${crypto.randomBytes(16).toString("hex")}`);

    keygen({ keep: false, location: dummyLocation }, (err, result) => {
      expect(expect(err).to.be.null);
      expect(expect(result.path).to.be.undefined);
      expect(result.private).to.match(/^-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----\n/);
      fs.readFile(dummyLocation, { encoding: "ascii" }, (fileReadErr, _) => {
        expect(expect(fileReadErr).to.not.be.null);
        expect(fileReadErr.code).to.eql("ENOENT");
        done();
      });
    });
  });

  it("should fail if a bad location is specified", (done) => {
    keygen({ location: "/bad/location/" }, (err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/No such file or directory/);
      done();
    });
  });

  it("should fail if trying to overwrite an existing file", (done) => {
    const dummyLocation = path.join(tmpDir, `dummy_file_to_discard_${crypto.randomBytes(16).toString("hex")}`);

    // run the process twice with a fixed location, and the second one should fail
    keygen({ keep: true, location: dummyLocation }, (firstErr, firstResult) => {
      expect(expect(firstErr).to.be.null);
      expect(expect(firstResult.path).to.not.be.undefined);
      expect(firstResult.private).to.match(/^-----BEGIN (RSA|OPENSSH) PRIVATE KEY-----\n/);
      keygen({ keep: true, location: dummyLocation }, (secondErr, _) => {
        expect(expect(secondErr).to.not.be.null);
        expect(secondErr).to.match(/Key not generated because it would overwrite an existing file/);
        done();
      });
    });
  });
});

describe("Advanced error scenarios", () => {
  afterEach(sinon.restore);

  function getFakeProcess() {
    const fakeProcess = new EventEmitter();
    const stdout = new EventEmitter();
    const stderr = new EventEmitter();
    fakeProcess.stdout = stdout;
    fakeProcess.stderr = stderr;
    return fakeProcess;
  }

  it("should fail when the private key file cannot be read", (done) => {
    const fakeProcess = getFakeProcess();
    sinon.stub(childProcess, "spawn").returns(fakeProcess);
    sinon.stub(fs, "readFile").yields(new Error("Some unexpected failure reading the private key"), "");

    setTimeout(() => {
      fakeProcess.emit("exit");
    }, 5);

    keygen((err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Some unexpected failure reading the private key/);
      done();
    });
  });

  it("should fail when the keygen process errors out", (done) => {
    const fakeProcess = getFakeProcess();
    sinon.stub(childProcess, "spawn").returns(fakeProcess);

    setTimeout(() => {
      fakeProcess.stderr.emit("data", "Something bad happened");
    }, 5);

    setTimeout(() => {
      fakeProcess.emit("exit");
    }, 10);

    keygen((err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Something bad happened/);
      done();
    });
  });

  it("should fail when the public key file cannot be read", (done) => {
    const fakeProcess = getFakeProcess();

    sinon.stub(childProcess, "spawn").returns(fakeProcess);
    const readFileStub = sinon.stub(fs, "readFile");
    readFileStub.onFirstCall().yields(undefined, "dummy private key");
    readFileStub.onSecondCall().yields(new Error("Some unexpected failure reading the public key"), "");

    setTimeout(() => {
      fakeProcess.emit("exit");
    }, 5);

    keygen((err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Some unexpected failure reading the public key/);
      done();
    });
  });

  it("should fail when the keygen process cannot generate a public key for some reason", (done) => {
    const fakeProcess = getFakeProcess();
    sinon.stub(childProcess, "spawn").returns(fakeProcess);
    const readFileStub = sinon.stub(fs, "readFile");
    readFileStub.onFirstCall().yields(undefined, "dummy private key");
    readFileStub.onSecondCall().yields(undefined, undefined);

    setTimeout(() => {
      fakeProcess.stderr.emit("data", "Something bad happened with the public key");
    }, 5);

    setTimeout(() => {
      fakeProcess.emit("exit");
    }, 10);

    keygen((err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Something bad happened with the public key/);
      done();
    });
  });

  it("should fail when the private key cannot be deleted", (done) => {
    const fakeProcess = getFakeProcess();
    sinon.stub(childProcess, "spawn").returns(fakeProcess);
    sinon.stub(fs, "readFile").yields(undefined, "some private/public key");
    sinon.stub(fs, "unlink").yields(new Error("Some unexpected failure deleting the private key"), "");

    setTimeout(() => {
      fakeProcess.emit("exit");
    }, 5);

    keygen((err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Some unexpected failure deleting the private key/);
      done();
    });
  });

  it("should fail when the public key cannot be deleted", (done) => {
    const fakeProcess = getFakeProcess();
    sinon.stub(childProcess, "spawn").returns(fakeProcess);
    sinon.stub(fs, "readFile").yields(undefined, "some private/public key");

    const unlinkStub = sinon.stub(fs, "unlink");
    unlinkStub.onFirstCall().yields(undefined);
    unlinkStub.onSecondCall().yields(new Error("Some unexpected failure deleting the public key"), "");

    setTimeout(() => {
      fakeProcess.emit("exit");
    }, 5);

    keygen((err, _) => {
      expect(expect(err).to.not.be.null);
      expect(err).to.match(/Some unexpected failure deleting the public key/);
      done();
    });
  });
});
