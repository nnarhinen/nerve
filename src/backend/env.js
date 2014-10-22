var env = require('node-env-file'),
    path = require('path'),
    fs = require('fs'),
    envFile = path.join(__dirname, '/../../.env');
if (fs.existsSync(envFile)) {
  env(envFile);
}

process.env.NODE_PATH = process.env.NODE_PATH + ':' + path.join(__dirname, '..') + ':' + path.join(__dirname, '..', '..');
require('module').Module._initPaths();


