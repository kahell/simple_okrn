const Ctrl = require("../controllers/persons");
const c_movie = require("../controllers/movies");
const Router = require("koa-router");
const router = new Router();

// Movie
router.post("/:id/actors", c_movie.addActors);
router.get("/:id/actors", c_movie.getMovie);

module.exports = router.routes();
