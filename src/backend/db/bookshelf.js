var knex,
    config = require('../config/db');

knex = require('knex')(config[process.env.NODE_ENVIRONMENT || 'development']);
var Bookshelf = module.exports = require('bookshelf')(knex);

module.exports.models = {};

require('./models/session')(Bookshelf);
require('./models/environment')(Bookshelf);
require('./models/user')(Bookshelf);
require('./models/oauth')(Bookshelf);
require('./models/settings')(Bookshelf);
require('./models/expenses')(Bookshelf);
require('./models/passwordless')(Bookshelf);
