var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('../api');

var UserStore = module.exports = Flux.createStore({
  actions: {
    'environments:reset:one': 'resetOne',
    'environments:update:one': 'updateOne'
  },
  initialize: function() {
    this.delayedSave = _.debounce(this.saveOne, 3000);
  },
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      environment: this.environment
    };
  },
  resetOne: function(env) {
    this.environment = env;
    this.loading = false;
    this.emitChange();
  },
  saveOne: function(bearerToken, env) {
    var self = this;
    this.emitChange('persisting');
    return api(bearerToken).saveEnvironment(env).then(function(env) {
      self.resetOne(env);
      self.emitChange('persisted');
    });

  },
  updateOne: function(data) {
    this.resetOne(data.environment);
    this.emitChange('waiting-for-modifications');
    this.delayedSave(data.bearerToken, data.environment);
  }
});

