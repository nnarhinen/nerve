var express = require('express'),
    //invoiceSchema = require('shared/schemas/user'),
    validator = require('shared/schemas/validator'),
    _ = require('underscore');

var router = module.exports = express.Router();

router.get('/', function(req, res, next) {
  var Invoice = req.app.get('bookshelf').models.Invoice;
  Invoice.query(function(qb) {
    qb.where({
      environment_id: req.user.get('environment_id')
    });
    qb.orderBy('invoice_number');
  }).fetchAll({withRelated: ['customer']}).then(function(col) {
    res.send(col.toJSON());
  });
});
/*
router.put('/:id', function(req, res, next) {
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
});*/
