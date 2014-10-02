'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('sessions', function(table) {
    table.dropColumn('data');
  });
};

exports.down = function(knex, Promise) {
  
};
