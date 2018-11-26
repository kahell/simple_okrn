module.exports = router => {
  router.prefix("/v1");
  router.use("/persons", require("./persons"));
  router.use("/movies", require("./movies"));
  router.use("/auth", require("./auth"));
};
