exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex("persons")
    .del()
    .then(function() {
      // Inserts seed entries
      return knex("persons").insert([
        {
          firstName: "Helfi",
          lastName: "Pangestu",
          age: 21,
          address: null
        },
        {
          firstName: "Rania",
          lastName: "Akhmalia",
          age: 22,
          address: null
        }
      ]);
    });
};
