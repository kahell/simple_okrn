exports.up = function(knex, Promise) {
  return knex.schema.createTable("users", table => {
    table.increments("id").primary();
    table.string("username").unique();
    table.string("password");
    table.string("description");
    table.text("avatar");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("modified_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("users");
};
