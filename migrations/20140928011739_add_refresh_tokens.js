'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('oauth_refresh_tokens', function(table) {
    table.increments('id').primary();
    table.string('refresh_token').unique();
    table.uuid('client_id').references('oauth_clients.client_id');
    table.timestamp('expires');
    table.integer('user_id').references('users.id');

    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('oauth_refresh_tokens');
};
