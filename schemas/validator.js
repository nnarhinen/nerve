var Validator = require('jsonschema').Validator,
    v = new Validator(),
    _ = require('underscore');

v.attributes.referenceNumber = function referenceNumberValidator(instance, schema, options, ctx) {
  if (typeof instance !== 'string') return;
  if (!schema.referenceNumber) return;
  if (instance.length < 2) return 'is not a valid reference number';
  var actual = instance.slice(0, -1),
      check = instance.slice(instance.length-1),
      multiplierMap = {'0': 7, '1': 3, '2': 1},
      calculatedCheckSum = _.chain(actual.split('').reverse().map(Number))
        .groupBy(function(n, i) { return i % 3; }).pairs()
        .map(function(pair) { return pair[1].map(function(n) { return n * multiplierMap[pair[0]]; }); })
        .flatten().reduce(function(m, n) { return m+n; }, 0).value();

  var calculatedCheck = Math.ceil(calculatedCheckSum / 10) * 10 - calculatedCheckSum;
  if (calculatedCheck !== Number(check)) return 'is not a valid reference number';
};

module.exports = v;
