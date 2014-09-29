var express = require('express'),
    router = module.exports = express.Router(),
    oauth = require('./oauth2').oauth2,
    expenses = require('./expenses'),
    settings = require('./api/settings'),
    bodyParser = require('body-parser'),
    Maventa = require('node-maventa'),
    AWS = require('aws-sdk'),
    Promise = require('bluebird');

AWS.config.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
AWS.config.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
AWS.config.region = 'eu-west-1';

var s3 = Promise.promisifyAll(new AWS.S3());


router.use(oauth.authorise());
router.use(bodyParser.json());
router.use(function(req, res, next) {
  var userId = req.user.id;
  var Bookshelf = req.app.get('bookshelf');
  Bookshelf.models.User.forge(req.user).fetch().then(function(user) {
    req.s3 = s3;
    req.user = user;
    req.getEnvironmentSettings = function() {
      var model = Bookshelf.models.Settings.forge({environment_id: req.user.get('environment_id')});
      return model.fetch().then(function(sett) {
        sett = sett || model;
        return sett;
      });
    }
    req.maventaClient = function() {
      return req.getEnvironmentSettings().then(function(sett) {
        //return new Maventa(process.env.MAVENTA_VENDOR_API_KEY, sett.get('maventa_api_key'), sett.get('maventa_company_uuid'), process.env.NODE_ENVIRONMENT !== 'production');
        return new Maventa(process.env.MAVENTA_VENDOR_API_KEY, sett.get('maventa_api_key'), sett.get('maventa_company_uuid'));
      });
    };
    next();
  }).catch(next);
});


router.get('/expenses/pending', expenses.pending); 
router.route('/settings').get(settings.fetch).put(settings.update);
router.use(oauth.errorHandler());
