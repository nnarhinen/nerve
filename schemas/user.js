var required = require('./required');
module.exports = {
  id: '/User',
  type: "object",
  properties: {
    name: required('string'),
    email: required('email'),
    password: required('string')
  }
};
