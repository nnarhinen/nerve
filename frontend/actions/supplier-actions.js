var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var SupplierActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).suppliers().then(function(suppliers) {
      AppDispatcher.resetSuppliers(suppliers);
    });
  },
  createNew: function(newSupplier) {
    var bearerToken = AppDispatcher.bearerToken;
    return api(bearerToken).saveSupplier(newSupplier).then(function(supplier) {
      AppDispatcher.resetOneSupplier(supplier);
      return supplier;
    });
  }
};


