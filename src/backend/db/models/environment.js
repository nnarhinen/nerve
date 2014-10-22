module.exports = function(Bookshelf) {
  Bookshelf.models.Environment = Bookshelf.Model.extend({
    tableName: 'environments',
    hasTimestamps: ['created_at', 'updated_at']
  });
};
