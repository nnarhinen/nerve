var express = require('express');

var router = module.exports = express.Router();

router.post('/url', function(req, res, next) {
  var data = req.body,
      model;
  if (data.type === 'expense_attachment') {
    model = req.app.get('bookshelf').models.ExpenseAttachment;
  }
  if (!model) return res.status(400).send({error: 'Unknown file type'});
  model.forge({environment_id: req.user.get('environment_id'), id: data.id}).fetch().then(function(model) {
    if (!model) return res.status(401).send({error: 'Forbidden'});
    var params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: model.get('s3path')
    };
    var url = req.s3.getSignedUrl('getObject', params);
    return res.send({url: url});
  }).catch(next);
});
