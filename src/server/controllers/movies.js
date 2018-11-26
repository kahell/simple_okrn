const { transaction } = require("objection");
const Movie = require("../models/Movie");

// Add Actors in Movie
async function addActors(ctx, next) {
  const movie = await Movie.query().findById(ctx.params.id);

  if (!movie) {
    ctx.throw(400, "movie not found");
  }

  await movie.$relatedQuery("actors").relate(ctx.request.body.id);

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Add actors success",
    data: movie
  };
}

async function getMovie(ctx, next) {
  const movie = await Movie.query().findById(ctx.params.id);

  if (!movie) {
    ctx.throw(400, "movie not found");
  }

  const actors = await movie.$relatedQuery("actors");

  // Respond
  ctx.status = 200;
  ctx.body = {
    message: "Add actors success",
    data: movie
  };
}

module.exports = {
  addActors,
  getMovie
};
