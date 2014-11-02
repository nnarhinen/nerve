'use strict';

exports.up = function(knex, Promise) {
  return knex.transaction(function(trx) {
    return trx.schema.createTable('product_lines', function(table) {
      table.increments('id').primary();
      table.integer('environment_id').notNull().references('environments.id');
      table.string('product_line').notNull();
      table.string('name').notNull();

      table.timestamps();
      table.unique(['environment_id', 'product_line']);
    }).then(function() {
      return trx.schema.createTable('products', function(table) {
        table.increments('id').primary();
        table.integer('environment_id').notNull().references('environments.id');
        table.integer('product_line_id').references('product_lines.id');
        table.string('product_number').notNull();
        table.string('name').notNull();
        table.integer('vat_percent');
        table.float('unit_price');
        table.string('unit');

        table.timestamps();
        table.unique(['environment_id', 'product_line_id', 'product_number']);
      });
    }).then(function() {
      return trx.schema.createTable('invoice_rows', function(table) {
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
      });
    }).then(function() {
      return trx.commit();
    });
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('invoice_rows').then(function() {
    return knex.schema.dropTable('products');
  }).then(function() {
    return knex.schema.dropTable('product_lines');
  });
};
