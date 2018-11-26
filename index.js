const BodyParser = require("koa-bodyparser");
const passport = require("koa-passport");
const respond = require("koa-respond");
const Router = require("koa-router");
const Logger = require("koa-logger");
const Helmet = require("koa-helmet");
const Cors = require("@koa/cors");
const Koa = require("koa");

const router = new Router();
const app = new Koa();

const knexConfig = require("./knexfile");
const { Model } = require("objection");
const Knex = require("knex");

// Initialize knex.
const knex = Knex(knexConfig.development);
Model.knex(knex); // Only One DB

app.use(Helmet());

if (process.env.NODE_ENV === "development") {
  app.use(Logger());
}

app.use(Cors());
app.use(
  BodyParser({
    enableTypes: ["json"],
    jsonLimit: "5mb",
    strict: true,
    onerror: function(err, ctx) {
      ctx.throw("body parse error", 422);
    }
  })
);

app.use(respond());

// authentication
require("./src/server/config/auth");
app.use(passport.initialize());
app.use(passport.session());

// API routes
require("./src/server/routes")(router);
app.use(router.routes());
app.use(router.allowedMethods());

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`API server started on http://localhost:${port}`)
);
