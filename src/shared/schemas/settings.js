var required = require('./required');
module.exports = {
  id: '/Settings',
  type: "object",
  properties: {
    maventa_api_key: {type: 'string'},
    maventa_company_uuid: {type: 'string'}
  }
};
