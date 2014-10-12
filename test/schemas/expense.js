var validator = require('../../schemas/validator'),
    expenseSchema = require('../../schemas/expense');
require('should');
describe('Expense schema', function() {
  it('should validate a receipt', function() {
    var obj = {
      expense_type: 'receipt',
      supplier_id: 123,
      sum: 123.4,
      expense_date: '2014-10-12'
    };
    var result = validator.validate(obj, expenseSchema);
    result.errors.should.have.lengthOf(0)
  });
  it('should fail for invoices without due_date', function() {
    var obj = {
      expense_type: 'invoice',
      supplier_id: 123,
      sum: 123.4,
      expense_date: '2014-10-12',
      iban: 'FI4819503000000010',
      bic: 'NDEAFIHH',
      reference_number: '13',
      due_date: '2014-10-19'
    };
    var result = validator.validate(obj, expenseSchema);
    result.errors.should.have.lengthOf(0);
  });
  it('should validate reference_number', function() {
    var obj = {
      expense_type: 'invoice',
      supplier_id: 123,
      sum: 123.4,
      expense_date: '2014-10-12',
      iban: 'FI4819503000000010',
      bic: 'NDEAFIHH',
      due_date: '2014-10-19'
    };
    ['54492899582187561412', '188922', '13'].forEach(function(rf) {
      obj.reference_number = rf;
      var result = validator.validate(obj, expenseSchema);
      result.errors.should.have.lengthOf(0);
    });
    ['111', '188923'].forEach(function(rf) {
      obj.reference_number = rf;
      var result = validator.validate(obj, expenseSchema);
      result.errors.should.have.lengthOf(1);
    });
  });
});
