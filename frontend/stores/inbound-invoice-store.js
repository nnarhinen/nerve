var Flux = require('delorean.js').Flux,
    _ = require('underscore');

var InboundInvoiceStore = module.exports = Flux.createStore({
  actions: {
    'inboundinvoices:reset:pending': 'resetPending'
  },
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      invoices: this.invoices,
      pending: this.pending
    };
  },
  resetPending: function(invoices) {
    this.pending = invoices;
    this.loading = false;
    this.emitChange();
  }
});

