//Load env
require('./env');

var dbConfig = require('./config/db'),
    _ = require('underscore');

module.exports = _.extend({}, dbConfig, {});
