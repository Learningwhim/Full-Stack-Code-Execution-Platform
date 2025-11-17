/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.alterTable('submissions', submissions => {
    submissions.string('roomCode'),
    submissions.integer('room_id')
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  return knex.schema.alterTable('submissions', table => {
        table.dropColumns('room_id', 'roomCode');
  });
};
