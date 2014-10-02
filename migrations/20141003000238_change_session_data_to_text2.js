'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('sessions', function(table) {
    table.text('data');
  });
};

exports.down = function(knex, Promise) {
  
};
