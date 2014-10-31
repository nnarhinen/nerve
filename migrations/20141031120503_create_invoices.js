'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('customers', function(table) {
    table.increments('id').primary();
    table.integer('environment_id').references('environments.id');
    table.integer('customer_number').notNull();
    table.string('name');
    table.string('business_id');
    table.string('email');
    table.string('phone');

    table.unique(['environment_id', 'customer_number'], 'customer_number_index');
    table.timestamps();
  }).then(function() {
    return knex.schema.createTable('invoices', function(table) {
      table.increments('id').primary();
      table.integer('customer_id').references('customers.id');
      table.integer('environment_id').references('environments.id');
      table.integer('invoice_number').notNull();
      table.date('due_date');
      table.date('invoice_date');
      table.string('reference_number');
      table.float('sum');

      table.unique(['environment_id', 'invoice_number'], 'invoice_number_index');

      table.timestamps();
    });
  });
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('invoices'),
    knex.schema.dropTable('customers')
  ]);
};
