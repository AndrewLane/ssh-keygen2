const assert = require('assert');
const keygen = require('..');

const opts = {
  type: 'rsa',
  bits: 4096,
  passphrase: 'this will encrypt the private key',
  location: '/tmp/example_rsa_key',
  keep: true, // this will keep the resulting files
  comment: 'optional comment for ssh public key',
};

keygen(opts, (err, keypair) => {
  assert.ifError(err);
  console.log(keypair.private); // eslint-disable-line no-console
  console.log(keypair.public); // eslint-disable-line no-console
  console.log(`${keypair.fingerprint}\n`); // eslint-disable-line no-console
  console.log(`${keypair.randomart}\n`); // eslint-disable-line no-console
});
