'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.string('bankson_auth_token');
    t.string('bankson_refresh_token');
    t.timestamp('bankson_token_expires_at');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('users', function(t) {
    t.dropColumn('bankson_token_expires_at');
    t.dropColumn('bankson_refresh_token');
    t.dropColumn('bankson_auth_token');
  });
};
