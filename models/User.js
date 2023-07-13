var knex = require("../database/connection");
var bcrypt = require("bcrypt");

class User {
  async new(name, email, password) {
    try {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);
      await knex
        .insert({ name, email, password: hash, role: 0 })
        .table("users");
    } catch (err) {
      console.log(err);
    }
  }

  async findEmail(email) {
    try {
      var result = await knex.select("*").from("users").where({ email: email });
      if (result.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}

module.exports = new User();
