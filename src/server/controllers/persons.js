const { transaction } = require("objection");
const Person = require("../models/Person");

async function add(ctx, next) {
  var insertedGraph = null;
  try {
    const graph = ctx.request.body;
    // It's a good idea to wrap `insertGraph` call in a transaction since it
    // may create multiple queries.
    insertedGraph = await transaction(Person.knex(), trx => {
      return (
        Person.query(trx)
          // For security reasons, limit the relations that can be inserted.
          .allowInsert("[pets, children.[pets, movies], movies, parent]")
          .insertGraph(graph)
      );
    });
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
      data: null
    };
    ctx.app.emit("error", err, ctx);
    return;
  }

  ctx.status = 200;
  ctx.body = {
    message: "Add data success",
    data: insertedGraph
  };
}

async function patch(ctx, next) {
  const person = await Person.query().patchAndFetchById(
    ctx.params.id,
    ctx.request.body
  );

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Update data success",
    data: person
  };
}

async function patchAndUpsert(ctx, next) {
  const graph = ctx.request.body;

  // Make sure only one person was sent.
  if (Array.isArray(graph)) {
    ctx.throw(400, "graph is array");
  }

  // Make sure the person has the correct id because `upsertGraph` uses the id fields
  // to determine which models need to be updated and which inserted.
  graph.id = parseInt(ctx.params.id, 10);

  // It's a good idea to wrap `upsertGraph` call in a transaction since it
  // may create multiple queries.
  const upsertedGraph = await transaction(Person.knex(), trx => {
    return (
      Person.query(trx)
        // For security reasons, limit the relations that can be upserted.
        .allowUpsert("[pets, children.[pets, movies], movies, parent]")
        .upsertGraph(graph)
    );
  });

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Update & Upsert data success",
    data: upsertedGraph
  };
}

async function getAll(ctx, next) {
  // We don't need to check for the existence of the query parameters because
  // we call the `skipUndefined` method. It causes the query builder methods
  // to do nothing if one of the values is undefined.
  const persons = await Person.query()
    .skipUndefined()
    // For security reasons, limit the relations that can be fetched.
    .allowEager(
      "[pets, parent, children.[pets, movies.actors], movies.actors.pets]"
    )
    .eager(ctx.query.eager)
    .where("age", ">=", ctx.request.query.minAge)
    .where("age", "<", ctx.request.query.maxAge)
    .where("firstName", "like", ctx.request.query.firstName)
    .orderBy("id")
    // Order eagerly loaded pets by name.
    .modifyEager("[pets, children.pets]", qb => qb.orderBy("name"));

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Get all persons",
    data: persons
  };
}

async function deleteData(ctx, next) {
  await Person.query().deleteById(ctx.params.id);

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Delete persons id " + ctx.params.id + " is success",
    data: null
  };
}

async function addChild(ctx, next) {
  const person = await Person.query().findById(ctx.params.id);

  if (!person) {
    ctx.throw(400, "person not found");
  }

  const child = await person.$relatedQuery("children").insert(ctx.request.body);

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Add child success",
    data: child
  };
}

// Pets
async function addPets(ctx, next) {
  var person = null;
  try {
    person = await Person.query().findById(ctx.params.id);
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = {
      message: err.message,
      data: null
    };
    ctx.app.emit("error", err, ctx);
    return;
  }

  if (!person) {
    ctx.throw(400, "person not found");
  }

  const pet = await person.$relatedQuery("pets").insert(ctx.request.body);

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Add pets success",
    data: pet
  };
}

// Get Pets
async function getPets(ctx, next) {
  const person = await Person.query().findById(ctx.params.id);

  if (!person) {
    ctx.throw(400, "person not found");
  }

  // We don't need to check for the existence of the query parameters because
  // we call the `skipUndefined` method. It causes the query builder methods
  // to do nothing if one of the values is undefined.
  const pets = await person
    .$relatedQuery("pets")
    .skipUndefined()
    .where("name", "like", ctx.request.query.name)
    .where("species", ctx.request.query.species);

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Get all pets success",
    data: pets
  };
}

// Add Movie
async function addMovies(ctx, next) {
  // Inserting a movie for a person creates two queries: the movie insert query
  // and the join table row insert query. It is wise to use a transaction here.
  const movie = await transaction(Person.knex(), async function(trx) {
    const person = await Person.query(trx).findById(ctx.params.id);

    if (!person) {
      ctx.throw(400, "person not found");
    }

    return person.$relatedQuery("movies", trx).insert(ctx.request.body);
  });

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Get all pets success",
    data: movie
  };
}

module.exports = {
  patchAndUpsert,
  deleteData,
  addChild,
  addMovies,
  addPets,
  getPets,
  getAll,
  patch,
  add
};
