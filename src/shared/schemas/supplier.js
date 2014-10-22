var required = require('./required');
module.exports = {
  id: '/Supplier',
  type: "object",
  properties: {
    name: required('string'),
    iban: {type: 'string', required: true, iban: true},
    bic: required('string')
  }
};
