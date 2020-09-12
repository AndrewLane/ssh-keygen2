const { expect } = require('chai');
const { describe, it } = require('mocha');
const keygen = require('..');

describe('basic tests', () => {
  it('generates', (done) => {
    keygen((err, result) => {
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
      expect(result.public).to.match(/^ssh-rsa /);
      expect(result.fingerprint.length > 0);
      expect(result.randomart.length > 0);
      done();
    });
  });
  it('encrypts', (done) => {
    keygen({ password: 'blahblahblah' }, (err, result) => {
      expect(expect(err).to.be.null);
      expect(result.private).to.match(/^-----BEGIN RSA PRIVATE KEY-----\n/);
      expect(result.private).to.match(/Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC/);
      expect(result.public).to.match(/^ssh-rsa /);
      expect(result.fingerprint.length > 0);
      expect(result.randomart.length > 0);
      done();
    });
  });
});
