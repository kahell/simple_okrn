exports.up = function(knex, Promise) {
  return knex.schema.createTable("persons_movies", table => {
    table.increments("id").primary();
    table
      .integer("personId")
      .unsigned()
      .references("id")
      .inTable("persons")
      .onDelete("CASCADE");
    table
      .integer("movieId")
      .unsigned()
      .references("id")
      .inTable("movies")
      .onDelete("CASCADE");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("modified_at").defaultTo(knex.fn.now());
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists("persons_movies");
};
