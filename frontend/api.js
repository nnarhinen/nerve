var axios = require('axios');

function Api(bearerToken) {
  this.bearerToken = bearerToken;
}

Api.prototype.get = function(url, opts) {
  opts = opts || {};
  opts.headers = opts.headers || {};
  opts.headers.Authorization = 'Bearer ' + this.bearerToken
  return axios.get(url, opts);
};

Api.prototype.settings = function() {
  return this.get('/api/settings');
};



module.exports = function(bearerToken) {
  return new Api(bearerToken);
};
