const { transaction } = require("objection");
const Person = require("../models/Person");

async function add(ctx, next) {
  const graph = ctx.request.body;
  // It's a good idea to wrap `insertGraph` call in a transaction since it
  // may create multiple queries.
  const insertedGraph = await transaction(Person.knex(), trx => {
    return (
      Person.query(trx)
        // For security reasons, limit the relations that can be inserted.
        .allowInsert("[pets, children.[pets, movies], movies, parent]")
        .insertGraph(graph)
    );
  });

  ctx.ok({
    message: "Add data success",
    data: insertedGraph
  });
}

module.exports = {
  add
};
