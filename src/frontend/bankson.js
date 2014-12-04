'use strict';

var axios = require('axios'),
    api = require('./api');


var a = {}, endPoint = process.env.BANKSON_ENDPOINT;

a.getBearerToken = function() {
  return api().banksonToken();
};

a.get = function(url) {
  return a.getBearerToken().then(function(bearerToken) {
    return axios.get(endPoint + url, {
      headers: {
        Authorization: 'Bearer ' + bearerToken
      }
    });
  });
};

a.me = function() {
  return a.get('/api/me').then(function(resp) {
    return resp.data;
  });
};


module.exports = function() {
  return a;
};
