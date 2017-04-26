/**
 * Created by libinqi on 2016/5/23.
 */
var sails = require('sails');

// src/app.js
// this assumes your build directory is /dist
var path = require('path');
var slash = require('slash');

var originalResolve = path.resolve;

global.__SERVER__ = true;
global.__CLIENT__ = false;
global.__DEBUG__ = true;

before(function (done) {

  /* eslint no-console:0 */
  if (!console.debug) {
    // electron - for 'devtool'
    console.debug = () => {
    };
  }

// override resolve to intercept invalid sails node_module paths
  path.resolve = function resolve() {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    if (args.length >= 2 && typeof args[0] === 'string' && typeof args[1] === 'string') {

      if (slash(args[0]).endsWith('/dist') && args[1] === 'node_modules') {
        args[1] = './../node_modules'; // force resolve to go up one dir
      }
    }
    return originalResolve.apply(this, args);
  };

  // Increase the Mocha timeout so that Sails has enough time to lift.
  this.timeout(15000);

  sails.lift({
    appPath: process.cwd() + '\\dist',
      port: 1330,
    connections: {
      localDiskDb: {
         adapter: 'sails-disk'
      },
      someMssqlServer: {
        //adapter: 'waterline-mssql',
        //host: '192.168.1.238',
        //user: 'all580', //optional
        // host: '127.0.0.1',
        // user: 'sa', //optional
        //password: 'all580', //optional
        //database: 'WSMS' //optional
      }
    },
    models: {
      connection: 'localDiskDb',
      //connection: 'someMssqlServer',
      migrate: 'alter'
    },
    // configuration for testing purposes
    hooks: {
      grunt: false // Here I disable Grunt hooks
    },
    log: {
      noShip: true,
      level: 'debug'
    }
  }, function (err, server) {
    if (err) return done(err);
    // here you can load fixtures, etc.
    done(err, sails);
  });
});

after(function (done) {
  // here you can clear fixtures, etc.
  sails.lower(done);
});
