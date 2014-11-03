'use strict';
var Flux = require('delorean.js').Flux,
    SettingsStore = require('../stores/settings-store'),
    settingsStore = new SettingsStore(),
    NotificationStore = require('../stores/notification-store'),
    notificationStore = new NotificationStore(),
    InboundInvoiceStore = require('../stores/inbound-invoice-store'),
    inboundInvoices = new InboundInvoiceStore(),
    SupplierStore = require('../stores/supplier-store'),
    supplierStore = new SupplierStore(),
    UserStore = require('../stores/user-store'),
    userStore = new UserStore(),
    EnvironmentStore = require('../stores/environment-store'),
    environmentStore = new EnvironmentStore(),
    InvoiceStore = require('../stores/invoice-store'),
    invoiceStore = new InvoiceStore(),
    InboxStore = require('frontend/stores/inbox-store'),
    inboxStore = new InboxStore();



var AppDispatcher = module.exports = Flux.createDispatcher({
  getStores: function() {
    return {
      settings: settingsStore,
      notifications: notificationStore,
      inboundInvoices: inboundInvoices,
      suppliers: supplierStore,
      users: userStore,
      environments: environmentStore,
      invoices: invoiceStore,
      inbox: inboxStore
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
  },
  updateInboundInvoice: function(invoice) {
    this.dispatch('inboundinvoices:update:one', {invoice: invoice, bearerToken: this.bearerToken});
  },
  resetSuppliers: function(suppliers) {
    this.dispatch('suppliers:reset', suppliers);
  },
  resetOneSupplier: function(supplier) {
    this.dispatch('suppliers:reset:one', supplier);
  },
  resetInvoices: function(invoices) {
    this.dispatch('invoices:reset', invoices);
  },
  resetOneInvoice: function(invoice) {
    this.dispatch('invoices:reset:one', invoice);
  },
  updateOneInvoice: function(invoice) {
    this.dispatch('invoices:update:one', {invoice: invoice, bearerToken: this.bearerToken});
  },
  resetCustomers: function(customers) {
    this.dispatch('customers:reset', customers);
  },
  resetOneCustomer: function(customer) {
    this.dispatch('customers:reset:one', customer);
  },
  resetMyUser: function(user) {
    this.dispatch('users:reset:me', user);
  },
  updateUser: function(user) {
    this.dispatch('users:update:one', {user: user, bearerToken: this.bearerToken});
  },
  resetEnvironment: function(env) {
    this.dispatch('environments:reset:one', env);
  },
  updateEnvironment: function(env) {
    this.dispatch('environments:update:one', {environment: env, bearerToken: this.bearerToken});
  },
  resetSomeInboxItems: function(itms) {
    this.dispatch('inbox:reset:some', itms);
  },
  resetOneInboxItem: function(itm) {
    this.dispatch('inbox:reset:one', itm);
  }
});


