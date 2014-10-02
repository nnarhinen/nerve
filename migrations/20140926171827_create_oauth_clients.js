'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('oauth_clients', function(table) {
    table.increments('id').primary();
    table.uuid('client_id').unique().notNullable();
    table.uuid('client_secret').unique();
    table.integer('environment_id').references('environments.id');
    table.string('name');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('oauth_clients');
};
