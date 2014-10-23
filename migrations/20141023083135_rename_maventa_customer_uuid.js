'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('settings', function(table) {
    table.renameColumn('maventa_customer_uuid', 'maventa_company_uuid');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('settings', function(table) {
    table.renameColumn('maventa_company_uuid', 'maventa_customer_uuid');
  });
};
