const assert = require("assert");
const keygen = require("..");

// generate a temporary keypair and return details
keygen((err, keypair) => {
  assert.ifError(err);
  console.log(keypair.private); // eslint-disable-line no-console
  console.log(keypair.public); // eslint-disable-line no-console
  console.log(`${keypair.fingerprint}\n`); // eslint-disable-line no-console
  console.log(`${keypair.randomart}\n`); // eslint-disable-line no-console
});
