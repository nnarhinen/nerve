var uuid = require('node-uuid');

module.exports = function(Bookshelf) {
  var OAuthClient = Bookshelf.Model.extend({
    tableName: 'oauth_clients',
    initialize: function() {
      this.on('creating', this.onCreate);
    },
    onCreate: function(model, attrs) {
      if (!attrs.client_id && !attrs.client_secret) {
        model.set({
          client_id: uuid.v4(),
          client_secret: uuid.v4()
        });
      }
    }
  });

  Bookshelf.models.OAuthClient = OAuthClient;
};
