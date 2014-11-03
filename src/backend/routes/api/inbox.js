'use strict';

var express = require('express'),
    router= express.Router();

router.get('/', function(req, res, next) {
  req.app.get('bookshelf').models.InboxItem.where({
    environment_id: req.user.get('environment_id')
  }).fetchAll({withRelated: ['attachments']}).then(function(col) {
    res.send(col.toJSON());
  }).catch(next);
});

router.get('/:id', function(req, res, next) {
  req.app.get('bookshelf').models.InboxItem.where({
    environment_id: req.user.get('environment_id'),
    id: req.params.id
  }).fetch({withRelated: ['attachments']}).then(function(model) {
    res.send(model.toJSON());
  }).catch(next);
});

module.exports = router;
