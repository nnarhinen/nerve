var express = require('express'),
    router = module.exports = express.Router(),
    oauth = require('./oauth2').oauth2,
    expenses = require('./expenses'),
    settings = require('./api/settings');

router.use(oauth.authorise());
router.use(function(req, res, next) {
  var userId = req.user.id;
  var Bookshelf = req.app.get('bookshelf');
  Bookshelf.models.User.forge(req.user).fetch().then(function(user) {
    req.user = user;
    req.getEnvironmentSettings = function() {
      return Bookshelf.models.Settings.forge(req.user.environment_id).fetch().then(function(sett) {
        sett = sett || new Bookshelf.models.Settings();
        return sett;
      });
    }
    next();
  }).catch(next);
});


router.get('/expenses/pending', expenses.pending); 
router.get('/settings', settings.fetch);
router.use(oauth.errorHandler());
