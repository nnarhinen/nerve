var Flux = require('delorean.js').Flux,
    SettingsStore = require('../stores/settings-store'),
    settingsStore = new SettingsStore(),
    NotificationStore = require('../stores/notification-store'),
    notificationStore = new NotificationStore(),
    InboundInvoiceStore = require('../stores/inbound-invoice-store'),
    inboundInvoices = new InboundInvoiceStore();

var AppDispatcher = module.exports = Flux.createDispatcher({
  getStores: function() {
    return {
      settings: settingsStore,
      notifications: notificationStore,
      inboundInvoices: inboundInvoices
    };
  },
  fetchSettings: function(bearerToken) {
    this.dispatch('settings:fetch', this.bearerToken);
  },
  changeSetting: function(name, value) {
    this.dispatch('settings:change', {bearerToken: this.bearerToken, name: name, value:value});
  },
  resetSettings: function(settings) {
    this.dispatch('settings:reset', settings);
  },
  saveSettings: function() {
    return this.dispatch('settings:save', this.bearerToken);
  },
  notify: function(notification) {
    this.dispatch('notification', notification);
  },
  resetPendingInboundInvoices: function(invoices) {
    this.dispatch('inboundinvoices:reset:pending', invoices);
  },
  resetInboundInvoice: function(invoice) {
    this.dispatch('inboundinvoices:reset:one', invoice);
  }
});


