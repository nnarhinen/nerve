var bases = require('bases');

module.exports = function(Bookshelf) {
  Bookshelf.models.Environment = Bookshelf.Model.extend({
    tableName: 'environments',
    hasTimestamps: ['created_at', 'updated_at'],
    getToken: function() {
      return bases.toBase52(1000000-this.id);
    }
  }, {
    fromToken: function(token) {
      return this.forge({id: 1000000 - bases.fromBase52(token)});
    }
  });
};
