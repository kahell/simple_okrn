function hello(ctx) {
  let user = "hello";
  ctx.ok({ user });
}

async function testing(ctx) {
  let data = await ctx.params.id;
  ctx.ok({ data });
}

module.exports = {
  hello,
  testing
};
