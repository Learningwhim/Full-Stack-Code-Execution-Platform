/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */exports.up = async function (knex) {
  const exists = await knex.schema.hasTable("rooms");
  if (!exists) {
    return knex.schema.createTable("rooms", (table) => {
      table.increments("room_id").primary();
      table.string("room_code", 255);
      table.integer("creator_id");
      table
        .timestamp("created_at")
        .notNullable()
        .defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .notNullable()
        .defaultTo(knex.fn.now());
    });
  }
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("rooms");
};
