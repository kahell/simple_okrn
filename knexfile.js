const path = require("path");

module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "",
      database: "objection_sample"
    },
    migrations: path.join(__dirname, "src", "server", "db")
  }
};
