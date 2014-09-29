var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var InboundInvoiceActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).inboundInvoices().then(function(invoices) {
      AppDispatcher.resetInboundInvoices(invoices);
    });
  }
};


