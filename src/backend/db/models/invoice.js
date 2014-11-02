/*jshint -W079 */
'use strict';
var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment'),
    utils = require('shared/utils'),
    omitEmpty = require('omit-empty');

module.exports = function(Bookshelf) {
  var o = function(i) {
    return i || 0;
  };

  var rowSumWithVat = function(row) {
    return o(row.unit_price) * o(row.amount) * (1 + o(row.vat_percent) / 100);
  };

  var rowSumWithoutVat = function(row) {
    return o(row.unit_price) * o(row.amount);
  };

  Bookshelf.models.Customer = Bookshelf.Model.extend({
    tableName: 'customers',
    hasTimestamps: ['created_at', 'updated_at'],
    maventaData: function() {
      return omitEmpty({
        email: this.get('email'),
        lang: this.get('lang') || 'FI',
        name: this.get('name'),
        post_code: this.invoicingAddress().zip,
        post_office: this.invoicingAddress().city,
        phone: this.get('phone'),
        customer_nr: this.get('customer_number'),
        ovt: this.get('ovt'),
        bid: this.get('business_id'),
        address1: this.invoicingAddress().street_address1,
        country: this.invoicingAddress().country,
        address2: this.invoicingAddress().street_address2
      });
    },
    invoicingAddress: function() {
      return {};
    }
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
      return this.belongsTo(Bookshelf.models.Customer);
    },
    decorate: function() {
      return _.extend(this.toJSON(), {due_date: moment(this.get('due_date')).format('YYYY-MM-DD'), invoice_date: moment(this.get('invoice_date')).format('YYYY-MM-DD')});
    },
    format: function(attrs) {
      if (_.isArray(attrs.rows)) {
        return _.extend({}, attrs, {rows: JSON.stringify(attrs.rows)});
      }
      return attrs;
    },
    maventaData: function() {
      var data = {
        invoice_nr: this.get('invoice_number'),
        date: moment(this.get('invoice_date')).toDate(),
        date_due: moment(this.get('due_date')).toDate(),
        reference_nr: this.get('reference_number'),
        sum: this.sumWithoutVat().toFixed(2),
        sum_tax: this.sumWithVat().toFixed(2),
        lang: this.related('customer').get('lang') || 'FI'
      };
      data.customer = this.related('customer').maventaData();
      data.items = this.maventaRows();
      return data;
    },
    maventaRows: function() {
      return this.get('rows').map(function(row, i) {
        return omitEmpty({
          subject: row.name,
          tax: row.vat_percent,
          sum: rowSumWithoutVat(row),
          sum_tax: rowSumWithVat(row),
          amount: row.amount,
          price: row.unit_price,
          position: i + 1,
          item_code: row.product_number
        });
      });
    },
    sumWithoutVat: function() {
      return this.get('rows').reduce(function(memo, row) {
        return memo + rowSumWithoutVat(row);
      }, 0);
    },
    sumWithVat: function() {
      return this.get('rows').reduce(function(memo, row) {
        return memo + rowSumWithVat(row);
      }, 0);
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


