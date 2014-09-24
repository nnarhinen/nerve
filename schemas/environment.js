var required = require('./required');
module.exports = {
  id: '/Environment',
  type: "object",
  properties: {
    name: required('string')
  }
};
