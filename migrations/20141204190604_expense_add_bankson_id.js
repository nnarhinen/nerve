'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('expenses', function(t) {
    t.string('bankson_id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('expenses', function(t) {
    t.dropColumn('bankson_id');
  });
};
