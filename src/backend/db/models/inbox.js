module.exports = function(bookshelf) {
  bookshelf.models.InboxItemAttachment = bookshelf.Model.extend({
    tableName: 'inbox_item_attachments',
    hasTimestamps: ['created_at', 'updated_at']
  });

  bookshelf.models.InboxItem = bookshelf.Model.extend({
    tableName: 'inbox_items',
    hasTimestamps: ['created_at', 'updated_at'],
    attachments: function() {
      return this.hasMany(bookshelf.models.InboxItemAttachment);
    }
  });
};
