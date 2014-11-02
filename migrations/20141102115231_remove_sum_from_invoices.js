'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('invoices', function(table) {
    table.dropColumn('sum');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('invoices', function(table) {
    table.float('sum');
  });
};
