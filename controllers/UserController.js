var User = require("../models/User");
var PasswordToken = require("../models/PasswordToken");
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

var secret = "jdijdiahiadhdiadhia";

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

  async changePassword(req, res) {
    var token = req.body.token;
    var password = req.body.password;
    var isTokenValid = await PasswordToken.validate(token);
    if (isTokenValid.status) {
      await User.changePassword(
        password,
        isTokenValid.token.user_id,
        isTokenValid.token.token
      );
      res.status(200);
      res.send("Senha alterada");
    } else {
      res.status(406);
      res.send("Token inválido!");
    }
  }

  async login(req, res) {
    var { email, password } = req.body;

    var user = await User.findByEmail(email);
    if (user != undefined) {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      jwt.sign(
        { email: user.email, role: user.role },
        secret,
        { expiresIn: "48h" },
        (err, token) => {
          if (err) {
            res.status(400);
            res.json({ err: "Falha interna" });
          } else {
            res.status(200);
            res.json({ token: token });
          }
        }
      );
    } else {
      res.json({ status: false });
    }
  }
}

module.exports = new UserController();
