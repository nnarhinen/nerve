var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment');

module.exports = function(Bookshelf) {

  Bookshelf.models.Invoice = Bookshelf.Model.extend({
    tableName: 'invoices',
    hasTimestamps: ['created_at', 'updated_at']
  });
};


