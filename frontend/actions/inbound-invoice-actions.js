var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var InboundInvoiceActions = module.exports = {
  fetchPending: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).pendingInboundInvoices().then(function(invoices) {
      AppDispatcher.resetPendingInboundInvoices(invoices);
    });
  }
};


