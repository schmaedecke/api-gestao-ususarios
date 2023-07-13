var knex = require("knex")({
  client: "mysql2",
  connection: {
    host: "127.0.0.1",
    user: "root",
    password: "G3s9t9v7l8i01!",
    database: "apiusers",
  },
});

module.exports = knex;
