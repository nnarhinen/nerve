'use strict';
var _ = require('underscore'),
    Promise = require('bluebird'),
    moment = require('moment'),
    dv = require('dv'),
    spawn = require('child_process').spawn,
    concat = require('concat-stream'),
    findBarcodes = require('fv/lib/find_barcodes').findBarcodes,
    XRegExp = require('xregexp').XRegExp;

module.exports = function(Bookshelf) {

  Bookshelf.models.Supplier = Bookshelf.Model.extend({
    tableName: 'suppliers',
    hasTimestamps: ['created_at', 'updated_at']
  });

  Bookshelf.models.Expense = Bookshelf.Model.extend({
    tableName: 'expenses',
    hasTimestamps: ['created_at', 'updated_at'],
    supplier: function() {
      return this.belongsTo(Bookshelf.models.Supplier);
    },
    attachments: function() {
      return this.hasMany(Bookshelf.models.ExpenseAttachment);
    },
    decorate: function() {
      return _.extend(this.toJSON(), {due_date: moment(this.get('due_date')).format('YYYY-MM-DD'), expense_date: moment(this.get('expense_date')).format('YYYY-MM-DD')});
    },
    payWithBankson: function(banksonClient, payload) {
      var self = this;
      return banksonClient.createPayment({
        from: payload.bank_account,
        recipient_iban: this.get('iban'),
        recipient_bic: this.get('bic'),
        amount: this.get('sum'),
        recipient_name: this.related('supplier').get('name'),
        payment_date: payload.payment_date,
        reference_number: this.get('reference_number'),
        vendor_reference: this.id.toString()
      }).then(function(paym) {
        return self.save({
          bankson_id: paym.id,
          status: 'paid',
          payment_date: new Date()
        });
      });
    }
  }, {
    createWithSupplierAndAttachments: function(expenseData, supplierData, attachments) {
      var self = this;
      //First find a supplier or create on
      return Bookshelf.models.Supplier.forge({
        business_id: supplierData.business_id,
        environment_id: supplierData.environment_id
      }).fetch().then(function(supplier) {
        if (supplier) return supplier.save(supplierData); //Always update info
        return Bookshelf.models.Supplier.forge(supplierData).save();
      }).then(function(supplier) {
        return self.forge(_.extend({supplier_id: supplier.id}, expenseData)).save();
      }).then(function(expense) {
        return Promise.all(attachments.map(function(att) {
          return Bookshelf.models.ExpenseAttachment.forge(_.extend({expense_id: expense.id}, att)).save();
        })).return(expense);
      });
    },
    parseBarCode4: function(str) {
      var r = XRegExp('^4(?<iban>[0-9]{16})(?<euros>[0-9]{6})(?<cents>[0-9]{2})[0-9]{3}(?<referenceNumber>[0-9]{20})(?<dueDate>[0-9]{6})');
      var res = XRegExp.exec(str, r);
      if (!res) return;
      return {
        iban: 'FI' + res.iban,
        sum: parseInt(res.euros, 10) + parseInt(res.cents, 10) / 100,
        referenceNumber: res.referenceNumber.replace(/^[0]+/, ''),
        dueDate: '20' + res.dueDate.match(/.{1,2}/g).join('-')
      };
    },
    invoiceDetailsFromBarcode: function(code) {
      if (code.type !== 'CODE_128') return;
      var str = code.data;
      if (str.charAt(0) === '4') return this.parseBarCode4(str);
      //TODO implement v5
    },
    invoiceDetailsFromAttachment: function(buf) {
      var self = this;
      return gs(buf).then(function(jpg) {
        var image = new dv.Image('jpg', jpg),
            barCodes = findBarcodes(image, new dv.ZXing())[0];
        if (!barCodes.length) return;
        for (var idx in barCodes) {
          var parsed = self.invoiceDetailsFromBarcode(barCodes[idx]);
          if (!parsed) continue;
          return parsed;
        }
      });
    }
  });

  Bookshelf.models.ExpenseAttachment = Bookshelf.Model.extend({
    tableName: 'expense_attachments',
    hasTimestamps: ['created_at', 'updated_at']
  });
};

function gs(buf) {
  return new Promise(function(resolve, reject) {
    var pr = spawn('gs', ['-o', '%stdout', '-sDEVICE=jpeg', '-r300', '-dLastPage=1', '-']);
    pr.stdout.pipe(concat(function(data) {
      resolve(data);
    }));
    pr.on('close', function(nbr) {
      if (Number(nbr)) reject(new Error('Failed to run ghostscript'));
    });
    pr.stdin.write(buf);
    pr.stdin.end();
  });
}
