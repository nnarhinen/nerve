var Flux = require('delorean.js').Flux,
    _ = require('underscore');

var SettingsStore = module.exports = Flux.createStore({
  actions: {
    'notification': 'notification'
  },
  notification: function(data) {
    var id = data.id;
    this.notifications[id] = data;
    this.emitChange();
    var self = this;
    if (data.ttl) {
      setTimeout(function() {
        self.remove(data.id);
      }, data.ttl);
    }
  },
  remove: function(id) {
    this.notifications = _.omit(this.notifications, id);
    this.emitChange();
  },
  notifications: {},
  getState: function() {
    return {notifications: this.notificationList()};
  },
  notificationList: function() {
    return _.values(this.notifications);
  }
});

