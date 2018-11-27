const { transaction } = require("objection");
const keys = require("../config/keys");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Load User Model
const Users = require("../models/Users");

// Load Input Validation
const validateLoginInput = require("../validations/login");

async function register(ctx, next) {
  var user = null;
  try {
    const graph = ctx.request.body;
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(graph.password, salt);
    // Change password
    graph.password = hash;
    user = await transaction(Users.knex(), trx => {
      return Users.query(trx)
        .allowInsert("[persons]")
        .insertGraph(graph);
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
    message: "success",
    data: user
  };
}

async function login(ctx, next) {
  const { errors, isValid } = validateLoginInput(ctx.request.body);
  return (ctx.body = {
    status: false,
    data: ctx.request.body
  });
  // Check Validation
  if (!isValid) {
    ctx.status = 400;
    return (ctx.body = {
      status: false,
      data: errors
    });
  }

  const username = ctx.request.body.username;
  const password = ctx.request.body.password;

  // Find user by email
  const user = await Users.query()
    .select("*")
    .where("username", "=", username);

  if (!user.length) {
    errors.username = "User not found";
    ctx.status = 400;
    return (ctx.body = {
      status: false,
      data: errors
    });
  }

  // Check Password
  const isMatch = await bcrypt.compare(password, user[0].password);

  if (isMatch) {
    // User Matched
    const payload = {
      id: user[0].id,
      username: user[0].username,
      avatar: user[0].avatar
    }; // Create JWT Payload

    // Sign Token
    var token = await jwt.sign(payload, keys.secretOrKey, {
      expiresIn: 3600
    });
    return (ctx.body = {
      success: true,
      token: "Bearer " + token
    });
  } else {
    errors.password = "Password incorect";
    ctx.status = 400;
    return (ctx.body = {
      status: false,
      data: errors
    });
  }
}

module.exports = {
  register,
  login
};
