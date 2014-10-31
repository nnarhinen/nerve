var Flux = require('delorean.js').Flux,
    _ = require('underscore');

var InvoiceStore = module.exports = Flux.createStore({
  actions: {
    'invoices:reset': 'reset',
    'invoices:reset:one': 'resetOne'
  },
  invoices: [],
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      invoices: this.invoices
    };
  },
  reset: function(invoices) {
    this.invoices = invoices;
    this.loading = false;
    this.emitChange();
  },
  resetOne: function(invoice) {
    this.loading = false;
    this.invoices = _.reject(this.invoices, function(one) { return one.id === invoice.id; }).concat(invoice);
    this.emitChange();
  }
});

