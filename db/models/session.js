module.exports = function(Bookshelf) {
  Bookshelf.models.Session = Bookshelf.Model.extend({
    tableName: 'sessions'
  });
};
