var express = require('express'),
    router = express.Router(),
    validator = require('shared/schemas/validator'),
    _ = require('underscore'),
    customerSchema = require('shared/schemas/customer');

router.get('/', function(req, res, next) {
  var base = req.app.get('bookshelf').models.Customer;

  if (req.query.q) {
    base = base.query(function(qb) {
      qb.whereRaw('lower(name) like \'%' + req.query.q + '%\'');
    });
  }
  base.fetchAll().then(function(col) {
    res.send(col.toJSON());
  }).catch(next);
});

router.post('/', function(req, res, next) {
  var Customer = req.app.get('bookshelf').models.Customer;
  var data = _.omit(req.body, 'environment_id', 'customer_number', 'id');
  var errorReport = validator.validate(data, customerSchema);
  if (errorReport.errors.length) return res.status(400).send({error: 'Validation faled', details: errorReport});
  req.getEnvironmentSettings().then(function(sett) {
    return Customer.create(_.extend(data, {environment_id: req.user.get('environment_id')}), {
      customer_number: sett.get('next_customer_number') || 1000
    }).then(function(cust) {
      return cust.fetch().then(function(cust) {
        res.status(201).send(cust.toJSON());
      });
    });
  }).catch(next);
});


module.exports = router;
