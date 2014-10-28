'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('inbox_items', function(table) {
    table.increments('id').primary();
    table.integer('environment_id').references('environments.id');
    table.string('from');
    table.string('sender');
    table.string('subject');
    table.text('body_html');
    table.text('body_plain');

    table.timestamps();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('inbox_items');
};
