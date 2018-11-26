const c_auth = require("../controllers/auth");
const Router = require("koa-router");
const router = new Router();

// Movie
router.post("/register", c_auth.register);

module.exports = router.routes();
