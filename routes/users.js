const Ctrl = require("../controllers/users");
const Router = require("koa-router");
const router = new Router();

router.get("/", Ctrl.hello);
router.get("/:id", Ctrl.testing);

module.exports = router.routes();
