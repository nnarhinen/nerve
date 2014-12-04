'use strict';

var moment = require('moment'),
    Promise = require('bluebird'),
    mmm = require('mmmagic'),
    Magic = mmm.Magic,
    magic = Promise.promisifyAll(new Magic(mmm.MAGIC_MIME_TYPE)),
    debug = require('debug')('nerve:api:expenses'),
    _ = require('underscore'),
    expenseSchema = require('shared/schemas/expense'),
    validator = require('shared/schemas/validator'),
    router = require('express').Router(),
    busboy = require('connect-busboy'),
    bankson = require('bankson');

module.exports = router;

router.get('/expenses/pending', function(req,res,next) {
  var Expense = req.app.get('bookshelf').models.Expense;

  var listAllExpenses = function() {
    Expense.query(function(qb) {
      qb.where({
        environment_id: req.user.get('environment_id'),
        status: 'unpaid'
      });
      qb.orderBy('due_date');
    }).fetchAll({withRelated: ['supplier', 'attachments']}).then(function(col) {
      res.send(col.map(function(m) { return m.decorate(); }));
    }).catch(next);
  };

  req.maventaClient().then(function(maventa) {
    if (!maventa) return listAllExpenses();
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
        return;
      }
      throw err;
    });
  }).catch(next);
});

router.get('/expenses/:id', function(req, res, next) {
  var Expense = req.app.get('bookshelf').models.Expense;
  Expense.where({
    environment_id: req.user.get('environment_id'),
    id: req.params.id
  }).fetch({withRelated: ['supplier', 'attachments']}).then(function(m)  {
    res.send(m.decorate());
  }).catch(next);
});
router.put('/expenses/:id', function(req, res, next) {
  var Expense = req.app.get('bookshelf').models.Expense;
  Expense.where({
    environment_id: req.user.get('environment_id'),
    id: req.params.id
  }).fetch({withRelated: ['supplier', 'attachments']}).then(function(m) {
    var data = _.omit(req.body, 'id', 'environment_id', 'supplier', 'attachments');
    var report = validator.validate(req.body, expenseSchema);
    if (report.errors.length) return res.status(400).send({error: 'Validation failed', details: report});
    return m.save(data).then(function() {
      res.send(m.decorate());
    });
  }).catch(next);
});

router.post('/expenses/:id/bank', function(req, res, next) {
  var Expense = req.app.get('bookshelf').models.Expense;
  Expense.where({
    environment_id: req.user.get('environment_id'),
    id: req.params.id
  }).fetch({withRelated: ['supplier', 'attachments']}).then(function(m) {
    return req.banksonClient().then(function(cl) {
      return m.payWithBankson(cl, req.body).then(function() {
        return m.save();
      });
    });
  }).then(function(m) {
    res.send(m.decorate());
  }).catch(bankson.BanksonError, function(err) {
    console.dir(err.response.data);
    res.status(400).send({
      message: 'Failed to send via bankson'
    });
  }).catch(next);
});


router.post('/expenses', function(req, res, next) {
  var Expense = req.app.get('bookshelf').models.Expense;
  var data = _.omit(req.body, 'id', 'environment_id', 'supplier', 'attachments');
  var report = validator.validate(data, expenseSchema);
  if (report.errors.length) return res.status(400).send({error: 'Validation failed', details: report});
  Expense.forge(_.extend({environment_id: req.user.get('environment_id')}, data)).save().then(function(exp) {
    return exp.supplier().fetch().then(function() {
      return exp.fetch({withRelated: ['supplier']});
    });
  }).then(function(exp) {
    res.status(201).send(exp.toJSON());
  }).catch(next);
});

router.post('/expenses/:id/attachments', busboy(), function(req, res, next) {
  var Expense = req.app.get('bookshelf').models.Expense,
      ExpenseAttachment = req.app.get('bookshelf').models.ExpenseAttachment;
  var envId = req.user.get('environment_id');
  Expense.where({id: req.params.id, environment_id: envId}).fetch().then(function(exp) {
    if (!exp) return res.status(404);
    return new Promise(function(resolve, reject) {
      var data = {},
          promises = [],
          fileNamePrefix = req.user.get('environment_id') + '/expenses/' + exp.id + '-' + Math.random().toString(36).substring(7),
          files = [],
          count = 0;
      debug('will save s3 files with prefix %s', fileNamePrefix);

      req.busboy.on('field', function(key, value) {
        data[key] = value;
      });
      req.busboy.on('file', function(key, file, fileName, encoding, mimeType) {
        count++;
        var s3key = fileNamePrefix + '-' + count + '-' + fileName;
        debug('will save with s3Key', s3key);
        files.push({name: s3key, mimeType: mimeType});

        //TODO revisit the idea of direct streaming without buffer
        var bufs = [];
        file.on('data', function(part) {
          bufs.push(part);
        });
        file.on('end', function() {
          promises.push(req.s3.putObjectAsync({
            Bucket: process.env.AWS_S3_BUCKET,
            Key: s3key,
            Body: Buffer.concat(bufs),
            ContentType: mimeType
          }));
        });
      });
      req.busboy.on('finish', function() {
        files.map(function(f) {
          return _.extend({}, data, {environment_id: envId, expense_id: req.params.id, s3path: f.name, mime_type: f.mimeType});
        }).forEach(function(d) {
          promises.push(ExpenseAttachment.forge(d).save());
        });
        Promise.all(promises).then(resolve).catch(reject);
      });
      req.busboy.on('error', reject);
      req.pipe(req.busboy);
    }).then(function() {
      return exp.attachments().fetch().then(function(col) {
        res.status(201).send(col.toJSON());
      });
    });
  }).catch(next);
});
