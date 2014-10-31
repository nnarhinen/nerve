var express = require('express'),
    invoiceSchema = require('shared/schemas/invoice'),
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

router.post('/', function(req, res, next) {
  var Invoice = req.app.get('bookshelf').models.Invoice;
  var data = _.omit(req.body, 'environment_id', 'invoice_number', 'id');
  var errorReport = validator.validate(data, invoiceSchema);
  if (errorReport.errors.length) return res.status(400).send({error: 'Validation faled', details: errorReport});
  req.getEnvironmentSettings().then(function(sett) {
    return Invoice.create(_.extend(data, {environment_id: req.user.get('environment_id')}), {
      invoice_number: sett.get('next_invoice_number') || 1000
    }).then(function(inv) {
      return inv.fetch({withRelated: ['customer']}).then(function(inv) {
        res.status(201).send(inv.toJSON());
      });
    });
  }).catch(next);
});

router.get('/:id', function(req, res, next) {
  var Invoice = req.app.get('bookshelf').models.Invoice;
  Invoice.where('id', req.params.id).fetch({withRelated: ['customer']}).then(function(inv) {
    if (!inv) return next();
    res.send(inv.toJSON());
  }).catch(next);
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