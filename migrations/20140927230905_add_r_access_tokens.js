'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('oauth_access_tokens', function(table) {
    table.increments('id').primary();
    table.string('access_token').unique();
    table.timestamp('expires');
    table.integer('user_id').references('users.id');
    table.string('client_id').references('oauth_clients.client_id');

    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('oauth_access_tokens');
};
