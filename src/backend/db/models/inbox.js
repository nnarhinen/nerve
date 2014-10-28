module.exports = function(bookshelf) {
  bookshelf.models.InboxItem = bookshelf.Model.extend({
    tableName: 'inbox_items',
    hasTimestamps: ['created_at', 'updated_at']
  });
};
