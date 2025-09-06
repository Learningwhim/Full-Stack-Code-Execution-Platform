/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.schema.createTable('rooms', rooms => {
    rooms.increments('room_id');
    rooms.string('room_code');
    rooms.integer('creator_id').references('users.user_id');
    rooms.timestamps(true, true);
  });
  await knex.schema.createTable('room_problems',room => {
    room.increments('room_problems_id');
    room.integer('room_id').references('rooms.room_id');
    room.integer('problem_id').references('problems.problem_id');
  });
  await knex.schema.createTable('room_participants',participant => {
    participant.increments('participant_id');
    participant.integer('room_id').references('rooms.room_id');
    participant.integer('user_id').references('users.user_id');
    participant.integer('score').defaultTo(0);
    participant.integer('total_time');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
     await knex.schema.dropTable('room_participants');
    await knex.schema.dropTable('room_problems');
  await knex.schema.dropTable('rooms');
  
};
