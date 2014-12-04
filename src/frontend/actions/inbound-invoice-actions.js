'use strict';
var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api'),
    moment = require('moment');
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
  resetOne: function(obj) {
    AppDispatcher.resetInboundInvoice(obj);
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
  },
  payWithBank: function(id, bankAccount) {
    api().payExpense(id, {
      bankson: true,
      bank_account: {
        iban: bankAccount.iban,
        bic: bankAccount.bic
      },
      payment_date: moment().format('YYYY-MM-DD')
    }).then(function(exp) {
      InboundInvoiceActions.resetOne(exp);
    });
  }
};


