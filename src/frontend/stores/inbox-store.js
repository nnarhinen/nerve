'use strict';
var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('frontend/api');

var InvoiceStore = module.exports = Flux.createStore({
  actions: {
    'inbox:reset:some': 'resetSome',
    'inbox:reset:one': 'resetOne'
  },
  initialize: function() {
    //this.delayedSave = _.debounce(this.saveToBackend, 1000);
  },
  items: [],
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      unread: this.items, // We might have some read / unread system too in the future
      items: this.items
    };
  },
  resetSome: function(items) {
    items.map(this.resetOne.bind(this));
  },
  resetOne: function(itm) {
    this.loading = false;
    this.items= _.reject(this.items, function(one) { return one.id === itm.id; }).concat(itm);
    this.emitChange();
  }/*,
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
  }*/
});

