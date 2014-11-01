var required = require('./required');
module.exports = {
  id: '/Customer',
  type: "object",
  properties: {
    name: required('string'),
    business_id: { type: 'string' },
    email: { type: 'string', format: 'email' },
    phone: { type: 'string'}
  }
};
