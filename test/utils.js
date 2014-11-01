var utils = require('../src/shared/utils');
require('should');

describe('utils', function() {
  describe('.referenceNumber', function() {
    it('should create valid reference numbers for numbers', function() {
      var validReferenceNumbers = ['54492899582187561412', '188922', '13'];

      var numbers = ['5449289958218756141', '18892', '1'];

      numbers.forEach(function(num, i) {
        utils.referenceNumber(num +'').should.equal(validReferenceNumbers[i]);
      });
    });
  });
});
