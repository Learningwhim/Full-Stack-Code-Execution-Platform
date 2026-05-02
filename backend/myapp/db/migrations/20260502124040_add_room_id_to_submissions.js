/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.alterTable('submissions', function(table) {
    table.integer('room_id').unsigned().nullable();

    table.foreign('room_id')
      .references('room_id')
      .inTable('rooms')
      .onDelete('SET NULL');
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('submissions', function(table) {
    table.dropForeign('room_id');
    table.dropColumn('room_id');
  });
};