var AppDispatcher = require('../dispatchers/app-dispatcher'),
    NotificationActions = require('./notification-actions');
    api = require('../api'),
    _ = require('underscore');

var notificationId = null;

var notify = function(notification) {
  notification.id = notificationId;
  var newId = NotificationActions.notify(notification).id;
  notificationId = notificationId || newId;
};

var delayedSave = _.debounce(function(name) {
  AppDispatcher.saveSettings().then(function() {
    notify({
      message: 'Saved!',
      state: 'success',
      ttl: 1000
    });
  });
  notify({
    message: 'Persisting..',
    state: 'info'
  });
}, 2000);

var SettingsActions = module.exports = {
  fetch: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).settings().then(function(settings) {
      AppDispatcher.resetSettings(settings);
    });
  },
  changeSetting: function(name, value) {
    AppDispatcher.changeSetting(name, value);
    var bearerToken = AppDispatcher.bearerToken;
    notify({
      message: 'Waiting for more modifications..',
      state: 'info'
    });
    delayedSave(name);
  }
};


