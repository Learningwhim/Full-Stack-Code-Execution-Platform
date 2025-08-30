/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTableIfNotExists('submissions', submissions =>{
    submissions.increments('submission_id');
    submissions.integer('problem_id');
    submissions.string('user_id');
    submissions.text('code');
    submissions.string('language');
    submissions.string('status').defaultTo("Pending");
    submissions.timestamp(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('submissions');
};
