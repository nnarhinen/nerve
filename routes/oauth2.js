var express = require('express'),
    bodyparser = require('body-parser'),
    oauthserver = require('node-oauth2-server'),
    Qs = require('qs');


var router = module.exports = express.Router();

var oauth = router.oauth2 = oauthserver({
  model: {}, // See below for specification
  grants: ['password'],
  debug: process.env.NODE_ENVIRONMENT === 'development'
});

router.use(bodyparser.urlencoded({extended: true}));
router.all('/oauth2/token', oauth.grant());

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

router.route('/oauth2/authorize')
        .get(redirectIfNoLogin, function(req, res, next) {
          res.render('authorize.html', {
            client_id: req.query.client_id,
            redirect_uri: req.query.redirect_uri
          });
        })
        .post(redirectIfNoLogin, oauth.authCodeGrant(function(req, next) {
          next(null, req.body.allow === 'yes', req.session.user);
        }));



router.route('/login')
        .get(function(req, res, next) {
          res.render('login.html', {
            title: 'Login',
            redirect: req.query.redirect,
            client_id: req.query.client_id,
            redirect_uri: req.query.redirect_uri
          });
        });
