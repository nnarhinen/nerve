var Bookshelf = require('../db/bookshelf'),
    OAuthClient = Bookshelf.models.OAuthClient,
    OAuthAccessToken = Bookshelf.models.OAuthAccessToken,
    OAuthAuthCode = Bookshelf.models.OAuthAuthCode,
    OAuthRefreshToken = Bookshelf.models.OAuthRefreshToken,
    _ = require('underscore');

var m = module.exports;

m.getClient = function(clientId, clientSecret, cb) {
  var params = {client_id: clientId};
  if (clientSecret) params.client_secret = clientSecret;
  var m = OAuthClient.forge(params);
  m.fetch().then(function(client) {
    if (!client) return cb(null, null);
    cb(null, {
      clientId: client.get('client_id'),
      clientSecret: client.get('client_secret'),
      redirectUri: client.get('redirect_uri'),
      name: client.get('name')
    });
  }).catch(cb);
};

m.getAccessToken = function(bearerToken, cb) {
  OAuthAccessToken.forge({access_token: bearerToken}).fetch().then(function(token) {
    if (!token) return cb(null, null);
    cb(null, {
      expires: new Date(token.get('expires')),
      userId: token.get('user_id')
    });
  }).catch(cb);
};

m.grantTypeAllowed = function(clientId, grantType, cb) {
  //FIXME
  cb(null, true);
};

m.saveAccessToken = function(accessToken, clientId, expires, user, cb) {
  OAuthAccessToken.forge({
    access_token: accessToken,
    client_id: clientId,
    expires: expires,
    user_id: user.id
  }).save().then(function() {
    cb();
  }).catch(cb);
};

m.getAuthCode = function(authCode, cb) {
  OAuthAuthCode.forge({
    auth_code: authCode
  }).fetch().then(function(code) {
    if (!code) return cb(null, null);
    cb(null, {
      clientId: code.get('client_id'),
      expires: new Date(code.get('expires')),
      userId: code.get('user_id')
    });
  }).catch(cb);
};

m.saveAuthCode = function(authCode, clientId, expires, user, cb) {
  OAuthAuthCode.forge({
    auth_code: authCode,
    client_id: clientId,
    expires: expires,
    user_id: user.id
  }).save().then(function() {
    cb();
  }).catch(cb);
};

m.saveRefreshToken = function(refreshToken, clientId, expires, user, cb) {
  OAuthRefreshToken.forge({
    refresh_token: refreshToken,
    client_id: clientId,
    expires: expires,
    user_id: user.id
  }).save().then(function() {
    cb();
  }).catch(cb);
};

m.getRefreshToken = function(refreshToken, cb) {
  OAuthRefreshToken.forge({
    refresh_token: refreshToken
  }).fetch().then(function(token) {
    if (!token) return cb(null, null);
    cb(null, {
      clientId: token.get('client_id'),
      expires: new Date(token.get('expires')),
      userId: token.get('user_id')
    });
  }).catch(cb);
};
