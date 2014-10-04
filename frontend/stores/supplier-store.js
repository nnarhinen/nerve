var Flux = require('delorean.js').Flux,
    _ = require('underscore');

var SupplierStore = module.exports = Flux.createStore({
  actions: {
    'suppliers:reset': 'reset'
  },
  suppliers: [],
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      suppliers: this.suppliers
    };
  },
  reset: function(suppliers) {
    this.suppliers = suppliers;
    this.loading = false;
    this.emitChange();
  }
});

