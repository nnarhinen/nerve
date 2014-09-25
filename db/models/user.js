module.exports = function(Bookshelf) {
  Bookshelf.models.User = Bookshelf.Model.extend({
    tableName: 'users'
  });
};
