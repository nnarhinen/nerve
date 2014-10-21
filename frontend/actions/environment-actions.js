var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var UserActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    return api(bearerToken).environment().then(function(env) {
      AppDispatcher.resetEnvironment(env);
      return env;
    });
  },
  update: function(one) {
    AppDispatcher.updateEnvironment(one);
  }
};


