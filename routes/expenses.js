var moment = require('moment'),
    Promise = require('bluebird'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic,
    magic = Promise.promisifyAll(new Magic(mmm.MAGIC_MIME_TYPE)),
    debug = require('debug')('nerve:api:expenses'),
    _ = require('underscore');

module.exports = {
  fetchOne: function(req, res, next) {
    var Expense = req.app.get('bookshelf').models.Expense;
    Expense.where({
      environment_id: req.user.get('environment_id'),
      id: req.params.id
    }).fetch({withRelated: ['supplier', 'attachments']}).then(function(m)  {
      res.send(m.toJSON());
    }).catch(next);
  },
  pending: function(req,res,next) {
    var Expense = req.app.get('bookshelf').models.Expense;

    var listAllExpenses = function() {
      Expense.query(function(qb) {
        qb.where({
          environment_id: req.user.get('environment_id'),
          status: 'unpaid'
        });
        qb.orderBy('due_date');
      }).fetchAll({withRelated: ['supplier', 'attachments']}).then(function(col) {
        res.send(col.toJSON());
      });
    };

    req.maventaClient().then(function(maventa) {
      return maventa.invoiceListInboundBetweenDates(moment().add(-3, 'months').toDate(), new Date()).then(function(resp) {
        return Promise.reduce(resp, function(m, inboundInvoice) { // We use reduce here to process sequentially to avoid duplicate suppliers etc
          return Expense.forge({
            intermediator_id: inboundInvoice.id,
            environment_id: req.user.get('environment_id')
          }).fetch().then(function(model) {
            debug('Searched for expense with intermediator_id %s and environmen_id %s, found: %s',
                  inboundInvoice.id,
                  req.user.get('environment_id'),
                  model ? model.id : 'nothing');
            if (model) return m.concat([model]);
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
                    return {type: att.attachment_type.toLowerCase(), s3path: fileName, mime_type: mimeType};
                  });
                });
              })).then(function(s3files) {
                //Here goes details saving from maventaInvoice
                var account = _.find(maventaInvoice.accounts, function(acc) { return !!acc.iban; });
                return Expense.createWithSupplierAndAttachments({
                  environment_id: req.user.get('environment_id'),
                  status: 'unpaid',
                  iban: account && account.iban,
                  bic: account && account.swift,
                  reference_number: maventaInvoice.reference_nr,
                  expense_date: moment(maventaInvoice.date, 'YYYYMMDD').toDate(),
                  due_date: moment(maventaInvoice.date_due, 'YYYYMMDD').toDate(),
                  expense_type: 'invoice',
                  sum: Number(maventaInvoice.sum),
                  intermediator: 'maventa',
                  intermediator_info: _.omit(maventaInvoice, 'attachments'),
                  intermediator_id: maventaInvoice.id
                }, {
                  name: maventaInvoice.company_name,
                  business_id: maventaInvoice.company_bid,
                  bic: account.swift,
                  iban: account.iban,
                  environment_id: req.user.get('environment_id')
                }, s3files.map(function(f) { return _.extend({environment_id: req.user.get('environment_id')}, f); })).then(function(model) {
                  return m.concat([model]);
                });
              });
            });
          });
        }, []).then(function(items) {
          debug('Processed %d items from maventa request', items.length);
          listAllExpenses();
        });
      }).catch(function(err) {
        if (err.message === 'ERROR: NO INVOICES') {
          debug('No new maventa invoices');
          listAllExpenses();
          return res.send([]);
        }
        throw err;
      });
    }).catch(next);
  }
};
