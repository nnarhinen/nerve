var axios = require('axios'),
    Promise = require('bluebird'),
    _ = require('underscore'),
    qs = require('qs');

function Api(bearerToken) {
  this.bearerToken = bearerToken;
}

var processOpts = function(bearerToken, opts) {
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers.Authorization = 'Bearer ' + bearerToken;
  return opts;
};

Api.prototype.get = function(url, opts) {
  opts = processOpts(this.bearerToken, opts);
  return Promise.resolve(axios.get(url, opts));
};

Api.prototype.put = function(url, data, opts) {
  opts = processOpts(this.bearerToken, opts);
  return Promise.resolve(axios.put(url, data, opts));
};

Api.prototype.post = function(url, data, opts) {
  opts = processOpts(this.bearerToken, opts);
  if (Object.prototype.toString.call(data) === '[object FormData]') {
    opts.transformRequest = [_.identity];
    //opts.headers['Content-Type'] = 'multipart/form-data';
  }
  
  return Promise.resolve(axios.post(url, data, opts));
};

Api.prototype.settings = function() {
  return this.get('/api/settings').then(function(resp) {
    return resp.data;
  });
};

Api.prototype.updateSettings = function(data) {
  return this.put('/api/settings', data).then(function(resp) {
    return resp.data;
  });
};

Api.prototype.pendingInboundInvoices = function() {
  return this.get('/api/expenses/pending').then(function(resp) {
    return resp.data;
  });
};

Api.prototype.inboundInvoice = function(id) {
  return this.get('/api/expenses/' + id).then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveExpense = function(exp) {
  var prom;
  if (exp.id) prom = this.put('/api/expenses/' + exp.id, exp);
  else prom = this.post('/api/expenses', exp);
  return prom.then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveExpenseAttachment = function(expId, attData, fileBlobs) {
  var data = new FormData();
  _.pairs(attData).filter(function(p) { return typeof p[1] !== 'object'; }).forEach(function(p) {
    data.append(p[0], p[1]);
  });
  _.pairs(fileBlobs).forEach(function(p) {
    data.append('file', p[1], p[0]);
  });
  var prom;
  if (attData.id) prom = this.put('/api/expenses/' + expId + '/attachments/' + attData.id, data);
  else prom = this.post('/api/expenses/' + expId + '/attachments', data);
  return prom.then(function(resp) {
    return resp.data;
  });
};

Api.prototype.suppliers= function() {
  return this.get('/api/suppliers').then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveSupplier = function(supplier) {
  var prom;
  if (supplier.id) prom = this.put('/api/suppliers/' + supplier.id, supplier);
  else prom = this.post('/api/suppliers', supplier);
  return prom.then(function(resp) {
    return resp.data;
  });
};

Api.prototype.invoices = function() {
  return this.get('/api/invoices').then(function(resp) {
    return resp.data;
  });
};

Api.prototype.invoice = function(id) {
  return this.get('/api/invoices/' + id).then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveInvoice= function(inv) {
  var prom;
  if (inv.id) prom = this.put('/api/invoices/' + inv.id, inv);
  else prom = this.post('/api/invoices', inv);
  return prom.then(function(resp) {
    return resp.data;
  });
};

Api.prototype.searchCustomers = function(search) {
  return this.get('/api/customers?' + qs.stringify(search)).then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveCustomer = function(cust) {
  var prom;
  if (cust.id) prom = this.put('/api/customers/' + cust.id, cust);
  else prom = this.post('/api/customers', cust);
  return prom.then(function(resp) {
    return resp.data;
  });
};

Api.prototype.me = function() {
  return this.get('/api/me').then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveUser = function(user) {
  var prom;
  if (user.id) prom = this.put('/api/users/' + user.id, user);
  else throw new Error('Creating of users not implemented');
  return prom.then(function(resp) {
    return resp.data;
  });
};

Api.prototype.environment = function() {
  return this.get('/api/environment').then(function(resp) {
    return resp.data;
  });
};

Api.prototype.saveEnvironment = function(env) {
  return this.put('/api/environment', env).then(function(resp) {
    return resp.data;
  });
};

Api.prototype.fileDownloadUrl = function(obj) {
  return this.post('/api/files/url', obj).then(function(resp) {
    return resp.data;
  });
};

var bearerToken;

module.exports = function(bt) {
  return new Api(bt || bearerToken);
};

module.exports.setBearerToken = function(bt) {
  bearerToken = bt;
};
