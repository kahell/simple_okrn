const c_persons = require("../controllers/persons");
const Router = require("koa-router");
const router = new Router();

// Persons
router.patch("/patch/:id/upsert", c_persons.patchAndUpsert);
router.patch("/patch/:id", c_persons.patch);
router.get("/getAll", c_persons.getAll);
router.delete("/:id", c_persons.deleteData);
router.post("/add", c_persons.add);

// Child
router.post("/:id/children", c_persons.addChild);

// Pets
router.post("/:id/pets", c_persons.addPets);
router.get("/:id/getPets", c_persons.getPets);

//Movie
router.post("/:id/movies", c_persons.addMovies);

module.exports = router.routes();
