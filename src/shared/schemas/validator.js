var Validator = require('jsonschema').Validator,
    v = new Validator(),
    _ = require('underscore'),
    Big = require('big.js');

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

v.attributes.iban = function ibanValidator(instance, schema, options, ctx) {
  if (typeof instance !== 'string') return;
  if (!schema.iban) return;
  if (instance.length != 18) return 'is not a valid IBAN';
  var actual = instance.slice(4),
      countryCode = instance.substring(0, 2),
      check = instance.substring(2, 4);
  actual += countryCode.split('').map(function(c) { return c.charCodeAt(0) - 55; }).join('');
  actual += check;
  if (!Big(actual).mod(97).eq(1)) return 'is not a valid IBAN';
};

module.exports = v;
