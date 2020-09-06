var keygen = require('../');
var assert = require('assert');

describe('basic', function () {
  it('generates', function (done) {
    keygen(function (err, result) {
      assert.ifError(err);
      console.log(result.private);
      assert(result.private.match(/^\-\-\-\-\-BEGIN RSA PRIVATE KEY\-\-\-\-\-\n/));
      assert(result.public.match(/^ssh\-rsa /));
      assert(result.fingerprint.length);
      assert(result.randomart.length);
      done();
    });
  });
  it('encrypts', function (done) {
    keygen({password: 'blahblahblah'}, function (err, result) {
      assert.ifError(err);
      console.log(result.private);
      assert(result.private.match(/^\-\-\-\-\-BEGIN RSA PRIVATE KEY\-\-\-\-\-\n/));
      assert(result.private.match(/Proc-Type: 4,ENCRYPTED\nDEK-Info: AES-128-CBC/));
      assert(result.public.match(/^ssh\-rsa /));
      assert(result.fingerprint.length);
      assert(result.randomart.length);
      done();
    });
  });
});