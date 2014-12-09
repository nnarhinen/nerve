'use strict';
require('yalr')({
  path: 'src/backend/public',
  port: 35730,
  debounce: 1000,
  match: [
    '*.js',
    '*.css'
  ]
});

var browserify = require('browserify'),
    watchify = require('watchify'),
    fs = require('fs'),
    bundler;

require('../src/backend/env');

bundler = watchify(browserify('./src/frontend/index.js', {
  basedir: __dirname + '/../',
  debug: true,
  cache: {},
  packageCache: {},
  fullPaths: true
}));

bundler.transform('reactify', {es6: true});
bundler.transform('envify');
bundler.transform('jedify', {lang: 'fi'});

bundler.on('update', function() {
  bundler.bundle().on('error', function(err) { console.error(err.message); }).pipe(fs.createWriteStream(__dirname + '/../src/backend/public/js/application.fi.js'));
});
bundler.bundle().on('error', function(err) { console.error(err.message); }).pipe(fs.createWriteStream(__dirname + '/../src/backend/public/js/application.fi.js'));
