var express = require('express'),
    bodyparser = require('body-parser'),
    oauthserver = require('node-oauth2-server'),
    Qs = require('qs'),
    _ = require('underscore'),
    Validator = require('jsonschema').Validator;

var v = new Validator();

var router = module.exports = express.Router();

var oauth = router.oauth2 = oauthserver({
  model: require('./oauth2-server-model'), // See below for specification
  grants: ['authorization_code', 'refresh_token'],
  debug: process.env.NODE_ENVIRONMENT !== 'production',
  passthroughErrors: true
});

router.use(bodyparser.urlencoded({extended: true}));
router.all('/oauth/token', oauth.grant());

var redirectIfNoLogin = function(req, res, next) {
  if (!req.session.user) {
    var params = {
      redirect: req.path,
      client_id: req.query.client_id,
      redirect_uri: req.query.redirect_uri
    };
    return res.redirect('/login?' + Qs.stringify(params));
  }
  next();
};

router.route('/oauth/authorize')
        .get(redirectIfNoLogin, function(req, res, next) {
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
        .post(redirectIfNoLogin, oauth.authCodeGrant(function(req, next) {
          next(null, req.body.allow === 'yes', req.session.user);
        }));

var UserSchema = _.clone(require('../schemas/user')),
    EnvironmentSchema = require('../schemas/environment');

UserSchema.properties.environment = {'$ref': '/Environment'};

v.addSchema(EnvironmentSchema, '/Environment');

var replaceRegex = /\.([^\.]+)/g,
    splitRegex = /\.(.+)?/;

router.route('/signup')
        .post(bodyparser.json(), function(req, res, next) {
          var renderError = function(errors) {
            return res.status(400).render('signup-form.html', _.extend({errors: errors}, req.body));
          };
          var report = v.validate(req.body, UserSchema, {propertyName: 'user'});
          if (!report.valid) {
            var errors = _.chain(report.errors).map(function(err) {
              return [err.property.split(splitRegex)[1].replace(replaceRegex, '[$1]'), err.message];
            }).object().value();
            return renderError(errors);
          }
          var User = req.app.get('bookshelf').models.User;
          User.exists({email: req.body.email}).then(function(exists) {
            if (exists) return renderError({email: 'is already registered'});
            return User.signupWithEnvironment(req.body).then(function(user) {
              res.status(201).send(user.decorate());
            });
          }).catch(next);
        });

router.route('/login')
        .get(function(req, res, next) {
          res.render('login.html', {
            title: 'Login',
            redirect: req.query.redirect,
            client_id: req.query.client_id,
            redirect_uri: req.query.redirect_uri
          });
        })
        .post(function(req, res, next) {
          var User = req.app.get('bookshelf').models.User;
          User.login(req.body.email, req.body.password).then(function(user) {
            if (!user) return res.status(400).render('login.html', {
              redirect: req.body.redirect,
              client_id: req.body.client_id,
              redirect_uri: req.body.redirect_uri,
              failedLogin: true,
              email: req.body.email
            });
            req.session.user = user.toJSON();
            res.redirect((req.body.redirect || '/app') + '?' + Qs.stringify({client_id: req.body.client_id, redirect_uri: req.body.redirect_uri}))
          }).catch(next);
        });

router.route('/logout')
      .get(function(req, res, next) {
        req.session.destroy();
        res.redirect('/');
      });

if (process.env.NODE_ENVIRONMENT === 'production') {
  router.use(oauth.errorHandler())
}
