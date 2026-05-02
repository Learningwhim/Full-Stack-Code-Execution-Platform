/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasColumn('submissions', 'room_id');

  if (!exists) {
    await knex.schema.alterTable('submissions', function(table) {
      table.integer('room_id').unsigned().nullable();
      table.foreign('room_id')
        .references('room_id')
        .inTable('rooms')
        .onDelete('SET NULL');
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const exists = await knex.schema.hasColumn('submissions', 'room_id');

  if (exists) {
    await knex.schema.alterTable('submissions', function(table) {
      table.dropForeign('room_id');
      table.dropColumn('room_id');
    });
  }
};
