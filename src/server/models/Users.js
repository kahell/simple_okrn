const { Model } = require("objection");

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["username", "password"],

      properties: {
        id: { type: "integer" },
        username: { type: ["string", "null"] },
        password: { type: "string", minLength: 1, maxLength: 255 },
        description: { type: "text" },
        avatar: { type: "text" }
      }
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // Import models here to prevent require loops.
    const Person = require("./Person");

    return {
      persons: {
        relation: Model.HasManyRelation,
        modelClass: Person,
        join: {
          from: "users.id",
          to: "persons.userId"
        }
      }
    };
  }
}

module.exports = Users;
