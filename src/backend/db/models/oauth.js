var uuid = require('node-uuid');

module.exports = function(Bookshelf) {
  var OAuthClient = Bookshelf.Model.extend({
    tableName: 'oauth_clients',
    hasTimestamps: ['created_at', 'updated_at'],
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

  var OAuthAuthCode = Bookshelf.Model.extend({
    tableName: 'oauth_auth_codes',
    hasTimestamps: ['created_at', 'updated_at']
  });

  var OAuthAccessToken = Bookshelf.Model.extend({
    tableName: 'oauth_access_tokens',
    hasTimestamps: ['created_at', 'updated_at']
  });

  var OAuthRefreshToken = Bookshelf.Model.extend({
    tableName: 'oauth_refresh_tokens',
    hasTimestamps: ['created_at', 'updated_at']
  });

  Bookshelf.models.OAuthClient = OAuthClient;
  Bookshelf.models.OAuthAuthCode = OAuthAuthCode;
  Bookshelf.models.OAuthAccessToken = OAuthAccessToken;
  Bookshelf.models.OAuthRefreshToken = OAuthRefreshToken;
};
