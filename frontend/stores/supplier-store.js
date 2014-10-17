var Flux = require('delorean.js').Flux,
    _ = require('underscore');

var SupplierStore = module.exports = Flux.createStore({
  actions: {
    'suppliers:reset': 'reset',
    'suppliers:reset:one': 'resetOne'
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
  },
  resetOne: function(supplier) {
    this.suppliers = _.reject(this.suppliers, function(one) { return one.id === supplier.id }).concat(supplier);
    this.emitChange();
  }
});

