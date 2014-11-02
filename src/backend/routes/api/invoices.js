'use strict';
var express = require('express'),
    invoiceSchema = require('shared/schemas/invoice'),
    validator = require('shared/schemas/validator'),
    _ = require('underscore'),
    debug = require('debug')('nerve:api:invoices');

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

router.use('/:id', function(req, res, next) {
  var Invoice = req.app.get('bookshelf').models.Invoice;
  Invoice.where({
    id: req.params.id,
    environment_id: req.user.get('environment_id')
  }).fetch({withRelated: ['customer']}).then(function(inv) {
    if (!inv) return res.status(404).send({error: 'Not found'});
    req.invoice = inv;
    next();
  }).catch(next);
});

router.get('/:id', function(req, res, next) {
  res.send(req.invoice.decorate());
});

router.put('/:id', function(req, res, next) {
  var inv = req.invoice;
  var data = _.omit(req.body, 'environment_id', 'invoice_number', 'id', 'customer');
  var errorReport = validator.validate(data, invoiceSchema);
  if (errorReport.errors.length) return res.status(400).send({error: 'Validation faled', details: errorReport});
  return inv.save(data).then(function(inv) {
    res.send(inv.decorate());
  }).catch(next);
});

router.post('/:id', function(req, res, next) {
  if (!req.body.maventa) return res.status(400).send({error: 'Invalid operation'}); // Only maventa allowed at this time
  var inv = req.invoice;
  if (!inv.related('customer')) return res.send(400).send({error: 'No customer'});
  req.maventaClient().then(function(client) {
    var invoiceData = inv.maventaData();
    debug('will send invoice with data: %s', JSON.stringify(invoiceData));
    return client.invoiceCreate(invoiceData).then(function(resp) {
      debug('invoice sent: response %s', JSON.stringify(resp));
      if (resp.status === 'OK: INVOICE CREATED') {
        return inv.save({status: 'sent', maventa_id: resp.invoice_id}).then(function(inv) {
          res.send(inv.decorate());
        });
      }
      res.status(400).send({
        error: 'Failed to send',
        maventa_response: resp
      });
    });
  }).catch(next);
});



