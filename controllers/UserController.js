var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");

class UserController {
  async index(req, res) {
    var users = await User.findAll();
    res.json(users);
  }

  async findUser(req, res) {
    var id = req.params.id;
    var user = await User.findById(id);
    if (user == undefined) {
      res.status(404);
      res.json({});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    var { email, name, password } = req.body;

    if (email == undefined) {
      res.status(400);
      res.json({ err: "O e-mail é inváido" });
      return;
    }

    var emailExists = await User.findEmail(email);

    if (emailExists) {
      res.status(406);
      res.json({ err: "O e-mail já está cadastrado!" });
      return;
    }

    await User.new(name, email, password);

    res.status(200);
    res.send("Tudo OK");
  }

  async edit(req, res) {
    var { id, name, email, role } = req.body;
    var result = await User.update(id, email, role, name);
    if (result != undefined) {
      if (result.status) {
        res.status(200);
        res.send("Tudo ok");
      } else {
        res.status(406);
        res.send(result.err);
      }
    } else {
      res.status(406);
      res.send("Oocrreu um erro no servidor");
    }
  }

  async remove(req, res) {
    var id = req.params.id;
    var result = await User.delete(id);
    if (result.status) {
      res.status(200);
      res.send("Tudo OK, DELETADO");
    } else {
      res.status(406);
      res.send(result.err);
    }
  }

  async recoverPassword(req, res) {
    var email = req.body.email;
    let user = await User.findByEmail(email);
    if (user != undefined) {
      var result = await PasswordToken.create(user);
    } else {
      res.status(406);
      res.send("O e-mail não existe no banco de dados");
    }
    if (result.status) {
      res.status(200);
      res.send("" + result.token);
    } else {
      res.status(406);
      res.send(result.err);
    }
  }
}

module.exports = new UserController();
