'use strict';
var express = require('express'),
    bodyparser = require('body-parser'),
    oauthserver = require('node-oauth2-server'),
    Qs = require('qs'),
    _ = require('underscore'),
    Validator = require('jsonschema').Validator,
    passwordless = require('passwordless'),
    BookshelfStore = require('passwordless-bookshelfstore'),
    Bookshelf = require('../db/bookshelf'),
    Mailgun = require('mailgun').Mailgun,
    util = require('util');

var mg = new Mailgun(process.env.MAILGUN_API_KEY);

passwordless.init(new BookshelfStore(Bookshelf.models.PasswordlessToken), {
  userProperty: 'userId'
});
passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback) {
  var host = process.env.NERVE_ENDPOINT;
  mg.sendText('no-reply@nerve.fi', recipient, 'Access to Nerve',
      util.format('Hello there!\nYou can access your Nerve account by following this link: %s/login?token=%s&uid=%s\n\n-The Nerve Team', host, tokenToSend, uidToSend), callback);
});

var router = module.exports = express.Router();

var oauth = router.oauth2 = oauthserver({
  model: require('./oauth2-server-model'), // See below for specification
  grants: ['authorization_code', 'refresh_token'],
  debug: process.env.NODE_ENV !== 'production'
});

router.use(bodyparser.urlencoded({extended: true}));
router.all('/oauth/token', oauth.grant());

router.use(passwordless.sessionSupport());
router.use(function(req, res, next) {
  if (!req.userId) return next();
  Bookshelf.models.User.where({id: req.userId}).fetch().then(function(u) {
    req.user = u && u.toJSON();
    next();
  }).catch(next);
});

router.route('/oauth/authorize')
        .get(passwordless.restricted({ originField: 'redirect', failureRedirect: '/login' }), function(req, res, next) {
          oauth.model.getClient(req.query.client_id, null, function(err, client) {
            if (err) return next(err);
            res.render('authorize.html', {
              client_id: req.query.client_id,
              redirect_uri: req.query.redirect_uri,
              response_type: req.query.response_type,
              client: client
            });
          });
        })
        .post(passwordless.restricted(), oauth.authCodeGrant(function(req, next) {
          next(null, req.body.allow === 'yes', req.user);
        }));

var replaceRegex = /\.([^\.]+)/g,
    splitRegex = /\.(.+)?/;

router.route('/login')
        .get(passwordless.acceptToken({enableOriginRedirect: true}), function(req, res, next) {
          res.render('login.html', {
            title: 'Login',
            redirect: req.query.redirect,
          });
        })
        .post(passwordless.requestToken(
            function(user, delivery, callback) {
              Bookshelf.models.User.where({email: user}).fetch().then(function(u) {
                if (u) return u;
                return Bookshelf.models.User.signupWithEnvironment({email: user, environment: {name: user + '\'s Company'}});
              }).then(function(u) {
                callback(null, u && u.id);
              }).catch(callback);
            }, { originField: 'redirect' }),
            function(req, res){
              res.redirect('/');
            });

router.route('/logout')
      .get(function(req, res, next) {
        req.session.destroy();
        res.redirect('/');
      });

if (process.env.NODE_ENV === 'production') {
  router.use(oauth.errorHandler());
}
