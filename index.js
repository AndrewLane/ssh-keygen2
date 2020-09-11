const { spawn } = require('child_process');
const path = require('path');
const tmpDir = require('os').tmpdir();
const crypto = require('crypto');
const fs = require('fs');

module.exports = (opts, cb) => {
  if (typeof opts === 'function') {
    cb = opts; // eslint-disable-line no-param-reassign
    opts = {}; // eslint-disable-line no-param-reassign
  }
  opts = opts || {}; // eslint-disable-line no-param-reassign
  let stderr = '';
  let stdout = '';
  const location = opts.location || path.join(tmpDir, crypto.randomBytes(16).toString('hex'));
  const args = [];
  const ret = {};

  if (opts.keep) ret.path = location;
  if (opts.type) args.push('-t', opts.type);
  if (opts.bits) args.push('-b', opts.bits);
  args.push('-C', opts.comment || '');
  args.push('-N', opts.passphrase || opts.password || '');
  args.push('-f', location);
  args.push('-m', 'PEM');

  const proc = spawn('ssh-keygen', args, opts);
  proc.stderr.on('data', (data) => {
    stderr += data;
  });
  proc.stdout.on('data', (data) => {
    stdout += data;
  });
  proc.on('exit', () => {
    fs.readFile(location, { encoding: 'ascii' }, (privateErr, privateKey) => { // eslint-disable-line consistent-return
      if (privateErr && privateErr.code !== 'ENOENT') return cb(privateErr);
      if (!privateKey) return cb(new Error(stderr));
      ret.private = privateKey;
      fs.readFile(`${location}.pub`, { encoding: 'ascii' }, (publicErr, publicKey) => { // eslint-disable-line consistent-return
        if (publicErr && publicErr.code !== 'ENOENT') return cb(publicErr);
        if (!publicKey) return cb(new Error(stderr));
        ret.public = publicKey;
        let match = stdout.match(/fingerprint is:\r?\n([^\r\n]+)\r?\n/);
        if (match) ret.fingerprint = match[1].trim();
        match = stdout.match(/randomart image is:\r?\n([\s\S]+)/);
        if (match) ret.randomart = match[1].trim();
        if (opts.keep) return cb(null, ret);
        fs.unlink(location, (unlinkPrivateErr) => { // eslint-disable-line consistent-return
          if (unlinkPrivateErr) return cb(unlinkPrivateErr);
          fs.unlink(`${location}.pub`, (unlinkPublicErr) => { // eslint-disable-line consistent-return
            if (unlinkPublicErr) return cb(unlinkPublicErr);
            cb(null, ret);
          });
        });
      });
    });
  });
};
