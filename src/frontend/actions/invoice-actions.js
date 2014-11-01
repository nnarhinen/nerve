'use strict';
var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var InvoiceActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).invoices().then(function(invoices) {
      AppDispatcher.resetInvoices(invoices);
    });
  },
  refreshOne: function(id) {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).invoice(id).then(function(invoice) {
      AppDispatcher.resetOneInvoice(invoice);
    });
  },
  createNew: function(newInvoice) {
    var bearerToken = AppDispatcher.bearerToken;
    return api(bearerToken).saveInvoice(newInvoice).then(function(invoice) {
      AppDispatcher.resetOneInvoice(invoice);
      return invoice;
    });
  },
  updateOne: function(one) {
    AppDispatcher.updateOneInvoice(one);
  }
};


