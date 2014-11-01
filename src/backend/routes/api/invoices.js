'use strict';
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
    res.send(col.map(function(one) { return one.decorate(); }));
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
        res.status(201).send(inv.decorate());
      });
    });
  }).catch(next);
});

router.get('/:id', function(req, res, next) {
  var Invoice = req.app.get('bookshelf').models.Invoice;
  Invoice.where({
    id: req.params.id,
    environment_id: req.user.get('environment_id')
  }).fetch({withRelated: ['customer']}).then(function(inv) {
    if (!inv) return next();
    res.send(inv.decorate());
  }).catch(next);
});

router.put('/:id', function(req, res, next) {
  var Invoice = req.app.get('bookshelf').models.Invoice;
  Invoice.where({
    id: req.params.id,
    environment_id: req.user.get('environment_id')
  }).fetch({withRelated: ['customer']}).then(function(inv) {
    if (!inv) return next();
    var data = _.omit(req.body, 'environment_id', 'invoice_number', 'id', 'customer');
    var errorReport = validator.validate(data, invoiceSchema);
    if (errorReport.errors.length) return res.status(400).send({error: 'Validation faled', details: errorReport});
    return inv.save(data).then(function(inv) {
      res.send(inv.decorate());
    });
  }).catch(next);
});
