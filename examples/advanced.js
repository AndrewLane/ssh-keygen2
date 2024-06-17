import assert from "assert";
import keygen from "../index.js";
import path from "path";
import os from "os";

const tmpDir = os.tmpdir();

const opts = {
  type: "rsa",
  bits: 4096,
  passphrase: "this will encrypt the private key",
  location: path.join(tmpDir, "example_rsa_key"),
  keep: true, // this will keep the resulting files
  comment: "optional comment for ssh public key",
};

keygen(opts, (err, keypair) => {
  assert.ifError(err);
  console.log(keypair.private);
  console.log(keypair.public);
  console.log(`${keypair.fingerprint}\n`);
  console.log(`${keypair.randomart}\n`);
});
