//Load env
require('./src/backend/config/env');

var dbConfig = require('./src/backend/config/db'),
    _ = require('underscore');

module.exports = _.extend({}, dbConfig, {});
