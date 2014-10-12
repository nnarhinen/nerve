var Validator = require('jsonschema').Validator,
    v = new Validator();

v.attributes.referenceNumber = function referenceNumberValidator(instance, schema, options, ctx) {
  if (typeof instance !== 'string') return;
  if (!schema.referenceNumber) return;
  if (instance.length < 2) return 'is not a valid reference number';
  var actual = instance.slice(0, -1),
      check = instance.slice(instance.length-1),
      calculatedCheckSum = 0,
      numbers = actual.split('').reverse().map(Number);
  for (var i = 0; i < numbers.length; i += 3) {
    calculatedCheckSum += numbers[i] * 7;
  }
  for (var i = 1; i < numbers.length; i += 3) {
    calculatedCheckSum += numbers[i] * 3;
  }
  for (var i = 2; i < numbers.length; i+= 3) {
    calculatedCheckSum += numbers[i];
  }
  var calculatedCheck = Math.ceil(calculatedCheckSum / 10) * 10 - calculatedCheckSum;
  if (calculatedCheck !== Number(check)) return 'is not a valid reference number';
};

module.exports = v;
