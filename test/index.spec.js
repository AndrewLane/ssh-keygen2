const fs = require("fs");
const tmpDir = require("os").tmpdir();
const path = require("path");
const crypto = require("crypto");
const { expect } = require("chai");
const { describe, it } = require("mocha");
const keygen = require("..");

describe("basic tests", () => {
  it("generates", (done) => {
    keygen((err, result) => {
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
      expect(result.public).to.match(/^ssh-rsa /);
      expect(result.fingerprint.length > 0);
      expect(result.randomart.length > 0);
      done();
    });
  });

  it("encrypts using password", (done) => {
    keygen({ password: "blahblahblah" }, (err, result) => {
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
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
      expect(result.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
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
    keygen({ bits: 1000000000 }, (err, _) => {
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
        expect(key).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
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
      expect(result.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
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
      expect(firstResult.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
      keygen({ keep: true, location: dummyLocation }, (secondErr, _) => {
        expect(expect(secondErr).to.not.be.null);
        expect(secondErr).to.match(/Key not generated because it would overwrite an existing file/);
        done();
      });
    });
  });
});
