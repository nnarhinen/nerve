var env = require('node-env-file'),
    path = require('path'),
    fs = require('fs'),
    envFile = path.join(__dirname, '.env');
if (fs.existsSync(envFile)) {
  env(envFile);
}


