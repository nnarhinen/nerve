var Promise = require('bluebird'),
    bcrypt = Promise.promisifyAll(require('bcrypt')),
    _ = require('underscore'),
    uuid = require('node-uuid');

module.exports = function(Bookshelf) {
  var User = Bookshelf.models.User = Bookshelf.Model.extend({
    tableName: 'users',
    hasTimestamps: ['created_at', 'updated_at'],
    environment: function() {
      return this.belongsTo(Bookshelf.models.Environment);
    },
    decorate: function() {
      return _.extend(_.omit(this.toJSON(), 'password_hash', 'bankson_refresh_token', 'bankson_token_expires_at'), {
        bankson_auth_token: !!this.get('bankson_auth_token')
      });
    }
  }, {
    exists: function(params) {
      return this.forge(params).fetch().then(function(existing) {
        return !!existing;
      });
    },
    signupWithEnvironment: function(params) {
      var self = this;
      return Bookshelf.models.Environment.forge(params.environment).save().then(function(environment) {
        return bcrypt.genSaltAsync(10).then(function(salt) {
          return bcrypt.hashAsync(params.password || uuid.v4(), salt);
        }).then(function(passwordHash) {
          params = _.extend(_.omit(params, 'environment', 'password'), {environment_id: environment.id, password_hash: passwordHash});
          return self.forge(params).save();
        });
      });
    },
    login: function(email, password) {
      return this.forge({email: email}).fetch().then(function(user) {
        if (!user) return null;
        return bcrypt.compareAsync(password, user.get('password_hash')).then(function(valid) {
          if (!valid) return null;
          return user;
        });
      });
    }
  });
};
