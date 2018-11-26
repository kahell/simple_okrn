const { Model } = require("objection");

class Person extends Model {
  static get tableName() {
    return "persons";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["firstName", "lastName"],

      properties: {
        id: { type: "integer" },
        parentId: { type: ["integer", "null"] },
        firstName: { type: "string", minLength: 1, maxLength: 255 },
        lastName: { type: "string", minLength: 1, maxLength: 255 },
        age: { type: "number" },

        address: {
          type: "object",
          properties: {
            street: { type: "string" },
            city: { type: "string" },
            zipCode: { type: "string" }
          }
        }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Import models here to prevent require loops.
    const Animal = require("./Animal");
    const Movie = require("./Movie");

    return {
      pets: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one.
        modelClass: Animal,
        join: {
          from: "persons.id",
          to: "animals.ownerId"
        }
      },

      movies: {
        relation: Model.ManyToManyRelation,
        modelClass: Movie,
        join: {
          from: "persons.id",
          // ManyToMany relation needs the `through` object
          // to describe the join table.
          through: {
            // If you have a model class for the join table
            // you need to specify it like this:
            // modelClass: PersonMovie,
            from: "persons_movies.personId",
            to: "persons_movies.movieId"
          },
          to: "movies.id"
        }
      },

      children: {
        relation: Model.HasManyRelation,
        modelClass: Person,
        join: {
          from: "persons.id",
          to: "persons.parentId"
        }
      },

      parent: {
        relation: Model.BelongsToOneRelation,
        modelClass: Person,
        join: {
          from: "persons.parentId",
          to: "persons.id"
        }
      }
    };
  }
}

module.exports = Person;
