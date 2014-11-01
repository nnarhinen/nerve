var _ = require('underscore');

module.exports.referenceNumber = function(actual) {
  actual = actual + '';
  var multiplierMap = {'0': 7, '1': 3, '2': 1},
      calculatedCheckSum = _.chain(actual.split('').reverse().map(Number))
        .groupBy(function(n, i) { return i % 3; }).pairs()
        .map(function(pair) { return pair[1].map(function(n) { return n * multiplierMap[pair[0]]; }); })
        .flatten().reduce(function(m, n) { return m+n; }, 0).value();

  var calculatedCheck = Math.ceil(calculatedCheckSum / 10) * 10 - calculatedCheckSum;
  return actual + '' + calculatedCheck;
};
