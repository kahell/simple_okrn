const { transaction } = require("objection");
const passport = require("koa-passport");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs");

async function register(ctx, next) {
  var user = null;
  try {
    const graph = ctx.request.body;
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(graph.password, salt);
    // Change password
    graph.password = hash;
    // It's a good idea to wrap `insertGraph` call in a transaction since it
    // may create multiple queries.
    user = await transaction(Users.knex(), trx => {
      return (
        Users.query(trx)
          // For security reasons, limit the relations that can be inserted.
          .allowInsert("[persons]")
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
  ctx.body = { message: "success" };

  //   return passport.authenticate("local", (err, user, info, status) => {
  //     if (user) {
  //       ctx.login(user);
  //       ctx.redirect("/auth/status");
  //     } else {
  //       ctx.status = 400;
  //       ctx.body = { status: "error" };
  //     }
  //   })(ctx);
}

module.exports = {
  register
};
