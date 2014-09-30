'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('suppliers', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('ovt');
      table.string('business_id');
      table.string('bic');
      table.string('iban');
      table.integer('environment_id').references('environments.id');

      table.timestamps();
    }),
    knex.schema.createTable('expenses', function(table) {
      table.increments('id').primary();
      table.string('status');
      table.integer('supplier_id').references('suppliers.id');
      table.string('iban');
      table.string('bic');
      table.string('reference_number');
      table.timestamp('expense_date');
      table.timestamp('due_date');
      table.string('expense_type');
      table.float('sum');
      table.string('intermediator');
      table.json('intermediator_info');
      table.string('intermediator_id');
      table.integer('environment_id').references('environments.id');

      table.timestamps();
    }),
    knex.schema.createTable('expense_attachments', function(table) {
      table.increments('id').primary();
      table.string('s3path').unique();
      table.integer('expense_id').references('expenses.id');
      table.integer('environment_id').references('environments.id');
      table.string('type');

      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('expenses'),
    knex.schema.dropTable('suppliers'),
    knex.schema.dropTable('expense_attachments')
  ]);
};
