var _ = require('underscore');

module.exports = function(typ, additional) {
  return _.extend({type: typ, required: true, minLength: 1}, additional);
};


