var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var InvoiceActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).invoices().then(function(invoices) {
      AppDispatcher.resetInvoices(invoices);
    });
  },
  createNew: function(newInvoice) {
    var bearerToken = AppDispatcher.bearerToken;
    return api(bearerToken).saveInvoice(newInvoice).then(function(invoice) {
      AppDispatcher.resetOneInvoice(invoice);
     invoice;
    });
  }
};


