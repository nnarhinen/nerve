var express = require('express'),
    userSchema = require('shared/schemas/user'),
    validator = require('shared/schemas/validator'),
    _ = require('underscore');

var router = module.exports = express.Router();

router.put('/:id', function(req, res, next) {
  if (req.user.id !== Number(req.params.id)) return res.status(403).send({error: 'Forbidden'});
  var User = req.app.get('bookshelf').models.User;
  User.where({id: req.params.id, environment_id: req.user.get('environment_id')}).fetch().then(function(user) {
    if (!user) return res.status(404).send({error: 'Not found'});
    var data = _.omit(req.body, 'environment_id', 'id', 'environment', 'password_hash', 'environment');
    var errorReport = validator.validate(data, userSchema);
    if (errorReport.errors.length) return res.status(400).send({error: 'Validation failed', details: errorReport});
    return user.save(data).then(function(user) {
      return res.send(user.decorate());
    });
  }).catch(next);
});
