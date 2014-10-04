var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var InboundInvoiceActions = module.exports = {
  fetchPending: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).pendingInboundInvoices().then(function(invoices) {
      AppDispatcher.resetPendingInboundInvoices(invoices);
    });
  },
  refreshOne: function(id) {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).inboundInvoice(id).then(function(invoice) {
      AppDispatcher.resetInboundInvoice(invoice);
    });
  },
  updateOne: function(inv) {
    AppDispatcher.updateInboundInvoice(inv);
    //TODO persist to backend
  }
};


