var AppDispatcher = require('../dispatchers/app-dispatcher'),
    NotificationActions = require('./notification-actions');
    api = require('../api'),
    _ = require('underscore');

var SettingsActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).settings().then(function(settings) {
      AppDispatcher.resetSettings(settings);
    });
  },
  changeSetting: function(name, value) {
    AppDispatcher.changeSetting(name, value);
  }
};


