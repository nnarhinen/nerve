'use strict';

var router = require('express').Router(),
    Bluebird = require('bluebird');

var oauth2 = require('simple-oauth2')({
  clientID: process.env.BANKSON_OAUTH_CLIENT_ID,
  clientSecret: process.env.BANKSON_OAUTH_CLIENT_SECRET,
  site: process.env.BANKSON_ENDPOINT,
  tokenPath: '/oauth/token'
});

var authorizationUri = oauth2.AuthCode.authorizeURL({
  redirect_uri: process.env.BANKSON_OAUTH_REDIRECT_URI
});

router.get('/connect/bankson', function(req, res, next) {
  req.session.banksonRedirect = req.query.redirect;
  req.session.save(function() {
    res.redirect(authorizationUri);
  });
});

router.post('/banksontoken', function(req, res, next) {
  if (!req.user.bankson_auth_token) return {};
  var prom = Bluebird.resolve(req.user.bankson_auth_token);
  var tokenData = {
    expires_in: (new Date(req.user.bankson_token_expires_at).getTime() - new Date().getTime()) / 1000,
    access_token: req.user.bankson_auth_token,
    refresh_token: req.user.bankson_refresh_token
  };
  var token = Bluebird.promisifyAll(oauth2.AccessToken.create(tokenData));
  if (token.expired()) {
    prom = token.refreshAsync().then(function(token) {
      return saveBanksonAuth(req, token).then(function() {
        return token.token.access_token;
      });
    });
  }
  prom.then(function(at) {
    res.send({bankson_auth_token: at});
  }).catch(next);
});

router.get('/callbacks/bankson', function(req, res, next) {
  var code = req.query.code;
  oauth2.AuthCode.getToken({
    code: code,
    redirect_uri: process.env.BANKSON_OAUTH_REDIRECT_URI
  }, function(err, result) {
    if (err) return next(err);
    var token = oauth2.AccessToken.create(result);
    saveBanksonAuth(req, token).then(function() {
      res.redirect(req.session.banksonRedirect);
    }).catch(next);
  });
});

module.exports.router = router;


function saveBanksonAuth(req, token) {
  return req.app.get('bookshelf').models.User.forge({
    id: req.user.id
  }).fetch().then(function(u) {
    return u.save({
      bankson_auth_token: token.token.access_token,
      bankson_refresh_token: token.token.refresh_token,
      bankson_token_expires_at: token.token.expires_at
    });
  });
}
