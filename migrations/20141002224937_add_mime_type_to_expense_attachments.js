'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('expense_attachments', function(table) {
    table.string('mime_type');
  });

};

exports.down = function(knex, Promise) {
  return knex.schema.table('expense_attachments', function(table) {
    table.dropColumn('mime_type');
  });
};
