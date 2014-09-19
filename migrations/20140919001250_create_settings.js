'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('settings', function(table) {
    table.increments('id').primary();
    table.integer('environment_id').references('environments.id');
    table.string('maventa_api_key');
    table.string('maventa_customer_uuid');
    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('settings');
};
