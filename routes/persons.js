const Ctrl = require("../controllers/persons");
const Router = require("koa-router");
const router = new Router();

router.post("/add", Ctrl.add);

module.exports = router.routes();
