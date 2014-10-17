'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('expenses', function(table) {
    table.timestamp('payment_date');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('expenses', function(table) {
    table.dropColumn('payment_date');
  });
};
