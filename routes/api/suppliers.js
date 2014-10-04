var express = require('express');

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
