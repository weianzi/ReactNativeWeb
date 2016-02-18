useGracefulFs();

function useGracefulFs() {
  var fs = require('fs');
  var gracefulFs = require('graceful-fs');

  // A bit sneaky but it's not straightforward to update all the
  // modules we depend on.
  Object.keys(fs).forEach(function(method) {
    if (typeof fs[method] === 'function' && gracefulFs[method]) {
      fs[method] = gracefulFs[method];
    }
  });
}

module.exports = require('./lib/')
