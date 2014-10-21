var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var UserActions = module.exports = {
  fetchMe: function() {
    var bearerToken = AppDispatcher.bearerToken;
    return api(bearerToken).me().then(function(user) {
      AppDispatcher.resetMyUser(user);
      return user;
    });
  },
  updateOne: function(one) {
    AppDispatcher.updateUser(one);
  }
};


