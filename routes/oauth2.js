var express = require('express'),
    bodyparser = require('body-parser'),
    oauthserver = require('node-oauth2-server');


var router = module.exports = express.Router();

var oauth = router.oauth2 = oauthserver({
  model: {}, // See below for specification
  grants: ['password'],
  debug: process.env.NODE_ENVIRONMENT === 'development'
});

router.use(bodyparser.urlencoded({extended: true}));
router.all('/oauth/token', oauth.grant());
