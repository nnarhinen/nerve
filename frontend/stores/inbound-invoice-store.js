var Flux = require('delorean.js').Flux,
    _ = require('underscore');

var InboundInvoiceStore = module.exports = Flux.createStore({
  actions: {
    'inboundinvoices:reset': 'reset'
  },
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return { invoices: this.invoices }
  },
  reset: function(invoices) {
    this.invoices = invoices;
    this.loading = false;
    this.emitChange();
  }
});

