var required = require('./required'),
    _ = require('underscore');
module.exports = {
  id: '/Expense',
  type: [{
    title: 'Expense (Invoice)',
    type: 'object',
    properties: {
      expense_type: { 'enum': ['invoice'] },
      iban: { required: true },
      reference_number: { required: true },
      bic: { required: true },
      due_date: { required: true  }
    }
  }, {
    title: 'Expense (receipt)',
    type: 'object',
    properties: {
      expense_type: { 'enum': ['receipt'] }
    }
  }],
  properties: {
    supplier_id: required('integer'),
    expense_date: _.extend({format: 'date'}, required('string')),
    sum: required('float'),
    iban: { type: 'string', iban: true },
    reference_number: { type: 'string', referenceNumber: true  },
    bic: { type: 'string',  minLength: 8, maxLength: 8  },
    due_date: { type: 'string', format: 'date' }
  }
};
