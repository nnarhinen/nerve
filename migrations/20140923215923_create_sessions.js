'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('sessions', function(table) {
    table.increments('id').primary();
    table.string('sid').unique();
    table.string('data');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('sessions');
};
