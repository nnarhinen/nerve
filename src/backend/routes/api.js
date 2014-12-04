'use strict';
var express = require('express'),
    router = module.exports = express.Router(),
    oauth = require('./oauth2').oauth2,
    expenses = require('./api/expenses'),
    settings = require('./api/settings'),
    bodyParser = require('body-parser'),
    Maventa = require('node-maventa'),
    _ = require('underscore'),
    envSchema = require('shared/schemas/environment'),
    validator = require('shared/schemas/validator'),
    BanksonClient = require('bankson').Client;

router.use(oauth.authorise());
router.use(bodyParser.json());
router.use(function(req, res, next) {
  var userId = req.user.id;
  var Bookshelf = req.app.get('bookshelf');
  Bookshelf.models.User.forge(req.user).fetch().then(function(user) {
    req.s3 = req.app.get('s3');
    req.user = user;
    req.getEnvironmentSettings = function() {
      var model = Bookshelf.models.Settings.forge({environment_id: req.user.get('environment_id')});
      return model.fetch().then(function(sett) {
        sett = sett || model;
        return sett;
      });
    };
    req.maventaClient = function() {
      return req.getEnvironmentSettings().then(function(sett) {
        if (!sett.get('maventa_api_key') || !sett.get('maventa_company_uuid')) return;
        //return new Maventa(process.env.MAVENTA_VENDOR_API_KEY, sett.get('maventa_api_key'), sett.get('maventa_company_uuid'), process.env.NODE_ENV !== 'production');
        return new Maventa(process.env.MAVENTA_VENDOR_API_KEY, sett.get('maventa_api_key'), sett.get('maventa_company_uuid'), process.env.NODE_ENV !== 'production');
      });
    };
    req.banksonClient = function() {
      var cl = new BanksonClient(process.env.BANKSON_OAUTH_CLIENT_ID, process.env.BANKSON_OAUTH_CLIENT_SECRET, process.env.BANKSON_OAUTH_REDIRECT_URI, process.env.BANKSON_ENDPOINT);
      cl.setTokens(
        req.user.get('bankson_auth_token'),
        req.user.get('bankson_refresh_token'),
        req.user.get('bankson_token_expires_at')
      );
      return cl.refreshTokens().then(function(cl) {
        return req.user.save({
          bankson_auth_token: cl.tokens.accessToken,
          bankson_refresh_token: cl.tokens.refreshToken,
          bankson_token_expires_at: cl.tokens.expiresAt.format()
        }).then(function() {
          return cl;
        });
      });
    };
    next();
  }).catch(next);
});

router.get('/me', function(req, res, next) {
  res.send(req.user.decorate());
});
router.route('/environment')
  .get(function(req, res, next) {
    req.user.environment().fetch().then(function(env) {
      res.send(env.toJSON());
    }).catch(next);
  })
  .put(function(req, res, next) {
    req.user.environment().fetch().then(function(env) {
      var data = _.omit(req.body, 'id', 'created_at', 'updated_at');
      var validationReport = validator.validate(data, envSchema);
      if (validationReport.errors.length) return res.status(400).send({error: 'Validation failed', details: validationReport});
      return env.save(data).then(function(env) {
        res.send(env.toJSON());
      });
    }).catch(next);
  });
router.use(expenses);
router.route('/settings').get(settings.fetch).put(settings.update);
router.use(require('./api/suppliers'));
router.use('/customers', require('./api/customers'));
router.use('/invoices', require('./api/invoices'));
router.use('/users', require('./api/users'));
router.use('/files', require('./api/files'));
router.use('/inbox', require('./api/inbox'));
router.use(oauth.errorHandler());
