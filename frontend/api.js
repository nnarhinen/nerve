var axios = require('axios');

function Api(bearerToken) {
  this.bearerToken = bearerToken;
}

var processOpts = function(bearerToken, opts) {
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers.Authorization = 'Bearer ' + bearerToken
  return opts;
}

Api.prototype.get = function(url, opts) {
  opts = processOpts(this.bearerToken, opts);
  return axios.get(url, opts);
};

Api.prototype.put = function(url, data, opts) {
  opts = processOpts(this.bearerToken, opts);
  return axios.put(url, data, opts);
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
}

module.exports = function(bearerToken) {
  return new Api(bearerToken);
};
