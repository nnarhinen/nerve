var AppDispatcher = require('../dispatchers/app-dispatcher');

var NotificationActions = module.exports = {
  notify: function(notification) {
    notification.id = notification.id || Math.random().toString(36).substring(2, 10);
    AppDispatcher.notify(notification);
    return notification;
  }
};


