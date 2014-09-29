var moment = require('moment'),
    Promise = require('bluebird'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic,
    magic = Promise.promisifyAll(new Magic(mmm.MAGIC_MIME_TYPE));

module.exports = {
  pending: function(req,res,next) {
    var Expense = req.app.get('bookshelf').models.Expense;
    req.maventaClient().then(function(maventa) {
      return maventa.invoiceListInboundBetweenDates(moment().add(-3, 'months').toDate(), new Date()).then(function(resp) {
        return Promise.all(resp.map(function(inboundInvoice) {
          return Expense.forge({intermediator_id: inboundInvoice.id, environment_id: req.user.get('environment_id')}).fetch().then(function(model) {
            if (!model) {
              //Fetch detailed information from Maventa
              return maventa.inboundInvoiceShow(inboundInvoice.id, true).then(function(maventaInvoice) {
                //Save attachments
                return Promise.all(maventaInvoice.attachments.map(function(att) {
                  return magic.detectAsync(att.file).then(function(mimeType) {
                    var fileName = req.user.get('environment_id') + '/expenses/' + att.filename;
                    return req.s3.putObjectAsync({
                      Bucket: process.env.AWS_S3_BUCKET,
                      Key: fileName,
                      Body: att.file,
                      ContentLength: att.file.length,
                      ContentType: mimeType
                    }).then(function() {
                      return {attachmentType: att.attachment_type, s3Path: fileName};
                    });
                  });
                })).then(function(s3Files) {
                  //Here goes details saving from maventaInvoice
                  console.log('s3Files', s3Files);
                  model = Expense.forge({environment_id: req.user.get('environment_id')});
                  return model;
                });
              });
            }
            return model;
          });
        })).then(function(items) {
          console.log('items', items);
          res.send(resp); //FIXME
        });
      }).catch(function(err) {
        if (err.message === 'ERROR: NO INVOICES') {
          return res.send([]);
        }
        throw err;
      });
    }).catch(next);
  }
};
