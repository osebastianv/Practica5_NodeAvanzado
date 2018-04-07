"use strict";

const jwt = require("jsonwebtoken");

/**
 * Modulo con función que devuelve un middleware
 * El middleware verifica si el token JWT es válido
 */
module.exports = function() {
  return function(req, res, next) {
    let token = null;

    //console.log("T1");
    const isAPI = req.originalUrl.indexOf("/apiv") === 0 ? true : false;
    //console.log("T2");

    if (isAPI) {
      token =
        req.session.authToken ||
        req.body.token ||
        req.query.token ||
        req.get("x-access-token");

      if (!token) {
        const err = new Error("no token provided");
        err.status = 401;
        next(err);
        return;
      }
    } else {
      token = req.session.authToken;

      if (!token) {
        res.redirect("/login");
        return;
      }
    }

    console.log("T", token);

    // verificamos el token JWT
    jwt.verify(token, process.env.JWT_SECRET, (err, descodificado) => {
      if (err) {
        console.log("T-error", error);
        next(err);
        return;
      }

      console.log("descodificado", descodificado);

      // apuntamos el _id en la petición para que lo usen los
      // siguientes middlewares
      req.session.apiUserId = descodificado._id;

      // el token es valido, por tanto dejo continuar
      next();
    });
  };
};
