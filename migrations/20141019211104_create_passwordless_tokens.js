'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('passwordless_tokens', function(table) {
    table.increments('id').primary();
    table.string('uid').unique();
    table.string('token').unique();
    table.timestamp('ttl');
    table.string('origin');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('passwordless_tokens');
};
