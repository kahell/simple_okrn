module.exports = router => {
  router.prefix("/v1");
  router.use("/users", require("./users"));
  router.use("/persons", require("./persons"));
};