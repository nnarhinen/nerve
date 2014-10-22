var Flux = require('delorean.js').Flux,
    _ = require('underscore'),
    api = require('../api');

var UserStore = module.exports = Flux.createStore({
  actions: {
    'users:reset:me': 'resetMe',
    'users:update:one': 'updateOne'
  },
  initialize: function() {
    this.delayedSave = _.debounce(this.saveOne, 3000);
  },
  suppliers: [],
  loading: true,
  getState: function() {
    if (this.loading) return { loading: true };
    return {
      users: this.users || [],
      me: this.me
    };
  },
  resetMe: function(user) {
    this.me = user;
    this.loading = false;
    this.emitChange();
  },
  resetOne: function(user) {
    if (user.id === this.me.id) this.me = user;
    //Todo update collection
  },
  saveOne: function(bearerToken, user) {
    var self = this;
    this.emitChange('persisting');
    return api(bearerToken).saveUser(user).then(function(user) {
      self.resetOne(user);
      self.emitChange('persisted');
    });

  },
  updateOne: function(data) {
    this.resetOne(data.user);
    this.emitChange('waiting-for-modifications');
    this.delayedSave(data.bearerToken, data.user);
  }
});

