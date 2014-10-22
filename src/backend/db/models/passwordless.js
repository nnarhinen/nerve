module.exports = function(bookshelf) {
  bookshelf.models.PasswordlessToken = bookshelf.Model.extend({
    tableName: 'passwordless_tokens',
    hasTimestamps: ['created_at', 'updated_at']
  });
};
