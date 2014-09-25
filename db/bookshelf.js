var knex,
    config = require('../config/db');

knex = require('knex')(config[process.env.NODE_ENVIRONMENT || 'development']);
var Bookshelf = module.exports = require('bookshelf')(knex);

module.exports.models = {};

require('./models/session')(Bookshelf);
require('./models/user')(Bookshelf);
