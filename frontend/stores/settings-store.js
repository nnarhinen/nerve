var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('../api');

var SettingsStore = module.exports = Flux.createStore({
  actions: {
    'settings:reset': 'reset',
    'settings:change': 'changeSettings',
    'settings:save': 'saveToBackend'
  },
  loading: true,
  getState: function() {
    if (this.loading) return {loading: true};
    return this.settings;
  },
  reset: function(settings) {
    this.loading = false;
    this.settings = settings;
    this.emitChange();
  },
  changeSettings: function(data) {
    this.settings[data.name] = data.value;
    this.emitChange();
  },
  saveToBackend: function(bearerToken) {
    var self = this;
    return api(bearerToken).updateSettings(this.settings).then(function(settings) {
      self.settings = settings;
      self.emit('change');
    });
  }
});

