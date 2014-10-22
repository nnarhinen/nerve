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
  },
  createNew: function(exp, fileBlobs) {
    var a = api(AppDispatcher.bearerToken);
    return a.saveExpense(exp).then(function(savedExpense) {
      return a.saveExpenseAttachment(savedExpense.id, {type: 'invoice_image'}, fileBlobs).then(function(att) {
        savedExpense.attachments = att;
        AppDispatcher.resetInboundInvoice(savedExpense);
        return savedExpense;
      });
    });
  }
};


