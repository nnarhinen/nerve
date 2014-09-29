module.exports = function(Bookshelf) {
  Bookshelf.models.Expense = Bookshelf.Model.extend({
    tableName: 'expenses',
    hasTimestamps: ['created_at', 'updated_at']
  });
};
