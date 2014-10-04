var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var SupplierActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).suppliers().then(function(suppliers) {
      AppDispatcher.resetSuppliers(suppliers);
    });
  }
};


