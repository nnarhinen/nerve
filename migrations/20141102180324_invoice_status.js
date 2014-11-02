'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('invoices', function(t) {
    t.string('status').notNull().defaultsTo('pending');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('invoices', function(t) {
    t.dropColumn('status');
  });
};
