var spawn = require('child_process').spawn
  , path = require('path')
  , tmpDir = require('os').tmpdir()
  , idgen = require('idgen')
  , fs = require('fs')

module.exports = function (opts, cb) {
  if (typeof opts === 'function') {
    cb = opts;
    opts = {};
  }
  opts || (opts = {});
  var stderr = ''
    , stdout = ''
    , location = opts.location || path.join(tmpDir, idgen())
    , args = []
    , ret = {}

  if (opts.keep) ret.path = location;
  if (opts.type) args.push('-t', opts.type);
  if (opts.bits) args.push('-b', opts.bits);
  args.push('-C', opts.comment || '');
  args.push('-N', opts.passphrase || opts.password || '');
  args.push('-f', location);
  args.push('-m', 'PEM');

  var proc = spawn('ssh-keygen', args, opts);
  proc.stderr.on('data', function (data) {
    stderr += data;
  });
  proc.stdout.on('data', function (data) {
    stdout += data;
  });
  proc.on('exit', function () {
    fs.readFile(location, {encoding: 'ascii'}, function (err, key) {
      if (err && err.code !== 'ENOENT') return cb(err);
      if (!key) return cb(new Error(stderr));
      ret.private = key;
      fs.readFile(location + '.pub', {encoding: 'ascii'}, function (err, key) {
        if (err && err.code !== 'ENOENT') return cb(err);
        if (!key) return cb(new Error(stderr));
        ret.public = key;
        var match = stdout.match(/fingerprint is:\r?\n([^\r\n]+)\r?\n/);
        if (match) ret.fingerprint = match[1].trim();
        var match = stdout.match(/randomart image is:\r?\n([\s\S]+)/);
        if (match) ret.randomart = match[1].trim();
        if (opts.keep) return cb(null, ret);
        fs.unlink(location, function (err) {
          if (err) return cb(err);
          fs.unlink(location + '.pub', function (err) {
            if (err) return cb(err);
            cb(null, ret);
          });
        });
      });
    });
  });
};
