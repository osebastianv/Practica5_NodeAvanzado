"use strict";

const i18n = require("../lib/i18nConfigure")();
const Usuario = require("../models/Usuario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class LoginController {
  // GET /
  index(req, res, next) {
    res.locals.email =
      process.env.NODE_ENV === "development" ? "user@example.com" : "";
    res.locals.error = "";
    res.render("login");
  }

  // POST /loginJWT
  async postLoginJWT(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;

    res.locals.error = "";
    res.locals.email = email;

    const user = await Usuario.findOne({ email: email });

    // Comprobar usuario encontrado y verificar la clave del usuario
    if (!user || !await bcrypt.compare(password, user.password)) {
      res.locals.error = res.__("Credenciales incorrectas");
      res.render("login");
      return;
    }

    console.log("process.env.JWT_SECRET", process.env.JWT_SECRET);

    // el usuario está y coincide la password
    jwt.sign(
      { _id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "2d"
      },
      (err, token) => {
        if (err) {
          next(err);
          return;
        }

        // sesión está autenticada
        req.session.authToken = token;

        // usuario encontrado y validado
        res.redirect("/");
      }
    );
  }

  // GET /logout
  logout(req, res, next) {
    delete req.session.authToken; // borrar authUser de la sesion
    delete req.session.apiUserId;
    req.session.regenerate(function(err) {
      // crear nueva sesión vacia
      if (err) {
        next(err);
        return;
      }
      res.redirect("/");
    });
  }
}

module.exports = new LoginController();
