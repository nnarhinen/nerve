'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('oauth_auth_codes', function(table) {
    table.increments('id').primary();
    table.string('auth_code').unique();
    table.string('client_id').references('oauth_clients.client_id');
    table.timestamp('expires');
    table.integer('user_id').references('users.id');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('oauth_auth_codes');
};
