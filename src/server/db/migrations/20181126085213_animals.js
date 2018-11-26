exports.up = function(knex, Promise) {
  return knex.schema.createTable("animals", table => {
    table.increments("id").primary();
    table
      .integer("ownerId")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");
    table.string("name");
    table.string("species");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("modified_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("animals");
};
