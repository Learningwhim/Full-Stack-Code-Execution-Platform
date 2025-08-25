/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTableIfNotExists('problems', problem => {
        problem.increments('problem_id'),
        problem.string('title'),
        problem.string('statement'),
        problem.integer('time_limit'),
        problem.integer('memory_limit')
        problem.timestamp(true , true);
    });

    await knex.schema.createTableIfNotExists('testcases', testcase => {
        testcase.increments('testcase_id'),
        testcase.integer('problem_id').references('problems.problem_id'),
        testcase.text('input'),
        testcase.text('expected_output')
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTableIfExists('testcases');
    await knex.schema.dropTableIfExists('problems');
};
