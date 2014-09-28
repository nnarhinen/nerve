var express = require('express'),
    router = module.exports = express.Router(),
    oauth = require('./oauth2').oauth2,
    expenses = require('./expenses'),
    settings = require('./api/settings'),
    bodyParser = require('body-parser');

router.use(oauth.authorise());
router.use(bodyParser.json());
router.use(function(req, res, next) {
  var userId = req.user.id;
  var Bookshelf = req.app.get('bookshelf');
  Bookshelf.models.User.forge(req.user).fetch().then(function(user) {
    req.user = user;
    req.getEnvironmentSettings = function() {
      var model = Bookshelf.models.Settings.forge({environment_id: req.user.get('environment_id')});
      return model.fetch().then(function(sett) {
        sett = sett || model;
        return sett;
      });
    }
    next();
  }).catch(next);
});


router.get('/expenses/pending', expenses.pending); 
router.route('/settings').get(settings.fetch).put(settings.update);
router.use(oauth.errorHandler());
