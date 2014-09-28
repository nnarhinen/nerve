var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('../api');

var SettingsStore = module.exports = Flux.createStore({
  actions: {
    'settings:fetch': 'fetch',
    'settings:change': 'changeSettings'
  },
  initialize: function() {
    this.saveToBackendDelayed = _.debounce(this.saveToBackend, 1000)
  },
  loading: true,
  getState: function() {
    if (this.loading) return {loading: true};
    return this.settings;
  },
  fetch: function(bearerToken) {
    var self = this;
    api(bearerToken).settings().then(function(settings) {
      self.loading = false;
      self.settings = settings;
      self.emit('change');
    });
  },
  changeSettings: function(data) {
    this.settings[data.name] = data.value;
    this.emit('change');
    this.saveToBackendDelayed(data);
  },
  saveToBackend: function(data) {
    var self = this;
    api(data.bearerToken).updateSettings(_.extend({}, this.settings, _.object([[data.name, data.value]]))).then(function(settings) {
      self.settings = settings;
      self.emit('change');
    });
  }
});

