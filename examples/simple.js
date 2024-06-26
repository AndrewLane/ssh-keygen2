import assert from "assert";
import keygen from "../index.js";

// generate a temporary keypair and return details
keygen((err, keypair) => {
  assert.ifError(err);
  console.log(keypair.private);
  console.log(keypair.public);
  console.log(`${keypair.fingerprint}\n`);
  console.log(`${keypair.randomart}\n`);
});
