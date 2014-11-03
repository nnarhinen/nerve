'use strict';
var AppDispatcher = require('../dispatchers/app-dispatcher'),
    api = require('../api');

var InvoiceActions = module.exports = {
  fetchUnread: function() {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).inboxUnread().then(function(items) {
      AppDispatcher.resetSomeInboxItems(items);
    });
  },
  fetchOne: function(id) {
    var bearerToken = AppDispatcher.bearerToken;
    api(bearerToken).inboxItem(id).then(function(itm) {
      AppDispatcher.resetOneInboxItem(itm);
    });
  }
};


