'use strict';

exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('invoice_rows'),
    knex.schema.table('invoices', function(table) {
      table.json('rows').notNull().defaultTo('[]');
    })]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('invoices', function(table) { table.dropColumn('rows'); }),
    knex.schema.createTable('invoice_rows', function(table) {
        table.increments('id').primary();
        table.integer('environment_id').notNull().references('environments.id');
        table.integer('invoice_id').notNull().references('invoices.id');
        table.integer('product_id').references('products.id');
        table.string('product_number');
        table.string('name').notNull();
        table.integer('vat_percent');
        table.float('unit_price');
        table.float('amount');
        table.string('unit');

        table.timestamps();
      })]);
};
