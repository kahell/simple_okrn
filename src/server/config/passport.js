const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;

const Users = require("../models/Users");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      const result = Users.query()
        .select("*")
        .where("users.id", "=", jwt_payload.id);
      if (result) {
        return done(null, result);
      }
      return done(null, false);
    })
  );
};
