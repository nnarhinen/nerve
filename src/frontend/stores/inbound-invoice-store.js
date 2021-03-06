'use strict';
var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('../api');

var InboundInvoiceStore = module.exports = Flux.createStore({
  actions: {
    'inboundinvoices:reset:pending': 'resetPending',
    'inboundinvoices:reset:one': 'resetOne',
    'inboundinvoices:update:one': 'updateOne'
  },
  initialize: function() {
    this.delayedSave = _.debounce(this.saveToBackend, 5000);
  },
  invoices: [],
  loading: true,
  pending: [],
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      invoices: this.invoices,
      pending: this.pending,
    };
  },
  getOne: function(id) {
    var finder = function(one) { return one.id === id; };
    return _.find(this.pending, finder) || _.find(this.invoices, finder);
  },
  resetPending: function(invoices) {
    this.pending = invoices;
    this.loading = false;
    this.emitChange();
  },
  resetOne: function(invoice) {
    var one = _.find(this.pending, function(i) {
      return i.id === invoice.id;
    });
    if (one) this.pending = _.without(this.pending, one);
    one = _.find(this.invoices, function(i) {
      return i.id === invoice.id;
    });
    if (one) this.invoices = _.without(this.invoices, one);
    var k = invoice.status === 'unpaid' ? 'pending' : 'invoices';
    this[k].push(invoice);
    this[k] = _.sortBy(this[k], 'due_date');
    this.loading = false;
    this.emitChange();
  },
  saveToBackend: function(bearerToken, invoice) {
    var self = this;
    this.emitChange('persisting');
    return api(bearerToken).saveExpense(invoice).then(function(invoice) {
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

