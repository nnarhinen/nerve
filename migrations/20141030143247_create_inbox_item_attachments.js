'use strict';

exports.up = function(knex, Promise) {
 return knex.schema.createTable('inbox_item_attachments', function(table) {
   table.increments('id').primary();
   table.string('s3path').unique();
   table.string('filename');
   table.string('mime_type');
   table.integer('inbox_item_id').references('inbox_items.id');
   table.integer('environment_id').references('environments.id');

   table.timestamps(); 
 });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('inbox_item_attachments');
};
