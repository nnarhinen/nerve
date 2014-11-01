'use strict';
var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('frontend/api');

var InvoiceStore = module.exports = Flux.createStore({
  actions: {
    'invoices:reset': 'reset',
    'invoices:reset:one': 'resetOne',
    'invoices:update:one': 'updateOne'
  },
  initialize: function() {
    this.delayedSave = _.debounce(this.saveToBackend, 1000);
  },
  invoices: [],
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      invoices: this.invoices
    };
  },
  reset: function(invoices) {
    this.invoices = invoices;
    this.loading = false;
    this.emitChange();
  },
  resetOne: function(invoice) {
    this.loading = false;
    this.invoices = _.reject(this.invoices, function(one) { return one.id === invoice.id; }).concat(invoice);
    this.emitChange();
  },
  saveToBackend: function(bearerToken, invoice) {
    var self = this;
    this.emitChange('persisting');
    return api(bearerToken).saveInvoice(invoice).then(function(invoice) {
      self.resetOne(invoice);
      self.emitChange('persisted');
    });
  },
  updateOne: function(data) {
    this.resetOne(data.invoice);
    this.emitChange('waiting-for-modifications');
    this.delayedSave(data.bearerToken, data.invoice);
  }
});

