module.exports = function(Bookshelf) {
  Bookshelf.models.Settings = Bookshelf.Model.extend({
    tableName: 'settings'
  });
};
