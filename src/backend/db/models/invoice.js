var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment'),
    utils = require('shared/utils');

module.exports = function(Bookshelf) {

  Bookshelf.models.Customer = Bookshelf.Model.extend({
    tableName: 'customers',
    hasTimestamps: ['created_at', 'updated_at']
  }, {
    create: function(data, defaults) {
      if (!data.environment_id) return Promise.reject(new Error('No environment id'));
      var self = this;
      return Bookshelf.knex('customers').where('environment_id', data.environment_id).max('customer_number').then(function(nr) {
        nr = nr[0].max ? nr[0].max + 1 : defaults.customer_number;
        return self.forge(_.extend(data, {customer_number: nr})).save();
      });
    }
  });

  Bookshelf.models.Invoice = Bookshelf.Model.extend({
    tableName: 'invoices',
    customer: function() {
      return this.belongsTo(Bookshelf.models.Customer)
    },
    decorate: function() {
      return _.extend(this.toJSON(), {due_date: moment(this.get('due_date')).format('YYYY-MM-DD'), invoice_date: moment(this.get('invoice_date')).format('YYYY-MM-DD')});
    },

    hasTimestamps: ['created_at', 'updated_at']
  }, {
    create: function(data, defaults) {
      if (!data.environment_id) return Promise.reject(new Error('No environment id'));
      var self = this;
      return Bookshelf.knex('invoices').where('environment_id', data.environment_id).max('invoice_number').then(function(nr) {
        nr = nr[0].max ? nr[0].max + 1 :  defaults.invoice_number;
        return self.forge(_.extend(data, {invoice_number: nr, reference_number: utils.referenceNumber(nr)})).save();
      });
    }
  });
};


