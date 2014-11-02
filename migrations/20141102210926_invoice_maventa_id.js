'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('invoices', function(table) {
    table.string('maventa_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('invoices', function(table) {
    table.dropColumn('maventa_id');
  });
};
