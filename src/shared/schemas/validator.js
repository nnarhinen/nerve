var Validator = require('jsonschema').Validator,
    v = new Validator(),
    _ = require('underscore'),
    Big = require('big.js'),
    utils = require('shared/utils');

v.attributes.referenceNumber = function referenceNumberValidator(instance, schema, options, ctx) {
  if (typeof instance !== 'string') return;
  if (!schema.referenceNumber) return;
  if (instance.length < 2) return 'is not a valid reference number';
  var actual = instance.slice(0, -1);
  if (utils.referenceNumber(actual) !== instance) return 'is not a valid reference number';
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
