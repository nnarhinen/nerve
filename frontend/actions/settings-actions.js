var AppDispatcher = require('../dispatchers/app-dispatcher');

var SettingsActions = module.exports = {
  fetch: function() {
    AppDispatcher.fetchSettings();
  },
  changeSetting: function(name, value) {
    AppDispatcher.changeSetting(name, value);
  }
};


