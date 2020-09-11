const assert = require('assert');
const { describe, it } = require('mocha');
const keygen = require('..');

describe('basic', () => {
  it('generates', (done) => {
    keygen((err, result) => {
      assert.ifError(err);
      assert(result.private.match(/^-----BEGIN RSA PRIVATE KEY-----\n/));
      assert(result.public.match(/^ssh-rsa /));
      assert(result.fingerprint.length);
      assert(result.randomart.length);
      done();
    });
  });
  it('encrypts', (done) => {
    keygen({ password: 'blahblahblah' }, (err, result) => {
      assert.ifError(err);
      assert(result.private.match(/^-----BEGIN RSA PRIVATE KEY-----\n/));
      assert(result.private.match(/Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC/));
      assert(result.public.match(/^ssh-rsa /));
      assert(result.fingerprint.length);
      assert(result.randomart.length);
      done();
    });
  });
});
