var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var CustomerActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).customers().then(function(invoices) {
      AppDispatcher.resetCustomers(invoices);
    });
  },
  refreshOne: function(id) {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).customer(id).then(function(custr) {
      AppDispatcher.resetOneCustomer(custr);
    });
  },
  updateOne: function(one) {
    AppDispatcher.resetOneCustomer(one);
  }
};


