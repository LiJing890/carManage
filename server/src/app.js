// src/app.js
// this assumes your build directory is /dist
import Path from 'path';
import slash from 'slash';

const originalResolve = Path.resolve;

global.__SERVER__ = true;
global.__CLIENT__ = false;
global.__DEBUG__ = true;

/* eslint no-console:0 */
if (!console.debug) {
  // electron - for 'devtool'
  console.debug = () => {};
}

// override resolve to intercept invalid sails node_module paths
Path.resolve = function resolve(...args) {
  if (args.length >= 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {

    if (slash(args[0]).endsWith('/dist') && args[1] === 'node_modules') {
      args[1] = './../node_modules'; // force resolve to go up one dir
    }
  }
  return originalResolve.apply(this, args);
};

(function lift() {
  require('sails').lift(Object.assign(require('rc')('sails'), {
    appPath: __dirname // set the appPath to this dir - so when compiled it's projectDir/dist
  }));
}());
