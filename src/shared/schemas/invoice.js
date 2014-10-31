var required = require('./required');
module.exports = {
  id: '/Invoice',
  type: "object",
  properties: {
    sum: required('number'),
    reference_number: { type: 'string', referenceNumber: true  },
    due_date: { type: 'string', format: 'date' },
    invoice_date: { type: 'string', format: 'date' },
    customer_id: { type: 'number' }
  }
};
