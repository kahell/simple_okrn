const c_auth = require("../controllers/auth");
const Router = require("koa-router");
const router = new Router();

// Movie
router.post("/register", c_auth.register);
router.post("/login", c_auth.login);

module.exports = router.routes();
