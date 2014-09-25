'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();
    table.integer('environment_id').references('environments.id');
    table.string('email').unique();
    table.string('name');
    table.string('password_hash');
    table.timestamps();
  });
 
};

exports.down = function(knex, Promise) {
  knex.schema.dropTable('users');
};
