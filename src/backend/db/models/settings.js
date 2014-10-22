module.exports = function(Bookshelf) {
  Bookshelf.models.Settings = Bookshelf.Model.extend({
    hasTimestamps: ['created_at', 'updated_at'],
    tableName: 'settings'
  });
};
