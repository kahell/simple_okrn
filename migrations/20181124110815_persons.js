exports.up = function(knex, Promise) {
  return knex.schema.createTable("persons", function(table) {
    table.increments("id").primary();
    table
      .integer("parentId")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("SET NULL");
    table.string("firstName");
    table.string("lastName");
    table.integer("age");
    table.json("address");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("modified_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("persons");
};
