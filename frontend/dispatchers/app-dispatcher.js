var Flux = require('delorean.js').Flux,
    SettingsStore = require('../stores/settings-store'),
    settingsStore = new SettingsStore();

var AppDispatcher = module.exports = Flux.createDispatcher({
  getStores: function() {
    return {
      settings: settingsStore
    };
  },
  fetchSettings: function(bearerToken) {
    this.dispatch('settings:fetch', this.bearerToken);
  },
  changeSetting: function(name, value) {
    this.dispatch('settings:change', {bearerToken: this.bearerToken, name: name, value:value});
  }
});


