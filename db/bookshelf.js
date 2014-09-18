var knex,
    config = require('../config/db');

knex = require('knex')(config[process.env.NODE_ENVIRONMENT || 'development']);
module.exports = require('bookshelf')(knex);
