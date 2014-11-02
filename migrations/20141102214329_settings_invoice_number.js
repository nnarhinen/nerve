'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('settings', function(table) {
    table.integer('next_invoice_number');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('settings', function(t) {
    t.dropColumn('next_invoice_number');
  });
};
