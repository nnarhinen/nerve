var express = require('express'),
    validator = require('shared/schemas/validator'),
    supplierSchema = require('shared/schemas/supplier');

var router = module.exports = express.Router();

router.get('/suppliers', function(req, res, next) {
  var Supplier = req.app.get('bookshelf').models.Supplier;
  Supplier.query(function(qb) {
    qb.where({environment_id: req.user.get('environment_id')});
    qb.orderBy('name');
  }).fetchAll().then(function(suppliers) {
    res.send(suppliers.toJSON());
  }).catch(next);
});

router.post('/suppliers', function(req, res, next) {
  var Supplier = req.app.get('bookshelf').models.Supplier;
  var report = validator.validate(req.body, supplierSchema);
  if (report.errors.length) return res.status(400).send({error: 'Validation failed', details: report});
  Supplier.forge(req.body).save().then(function(supplier) {
    res.status(201).send(supplier);
  }).catch(next);
});
