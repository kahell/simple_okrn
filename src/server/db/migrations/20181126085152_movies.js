exports.up = function(knex, Promise) {
  return knex.schema.createTable("movies", table => {
    table.increments("id").primary();
    table.string("name");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("modified_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("movies");
};
