/* global describe,it */
'use strict';
var fs = require('fs'),
    path = require('path'),
    Bookshelf = require('../../src/backend/db/bookshelf'),
    ExpenseModel = Bookshelf.models.Expense;

require('should');

describe('ExpenseModel', function() {
  describe('::invoiceDetailsFromAttachment', function() {
    it('should read invoice details from barcode', function() {
      this.timeout(5000);
      var file = fs.readFileSync(path.join(__dirname, '..', 'assets', 'invoice.pdf'));
      return ExpenseModel.invoiceDetailsFromAttachment(file).then(function(details) {
        (!!details).should.be.ok;
        details.iban.should.equal('FI4819503000000010');
        //details.bic.should.equal('NDEAFIHH');
        details.sum.should.equal(496);
        details.dueDate.should.equal('2014-12-24');
        details.referenceNumber.should.equal('10003');
      });
    });
  });
});
