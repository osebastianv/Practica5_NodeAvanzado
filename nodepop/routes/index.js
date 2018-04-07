var express = require("express");
var router = express.Router();

const Anuncio = require("../models/Anuncio");
const Usuario = require("../models/Usuario");

/* GET home page. */
router.get("/", async function(req, res, next) {
  try {
    //User
    try {
      req.user = await Usuario.findById(req.session.apiUserId);
      res.locals.userEmail = req.user.email;
    } catch (err) {
      res.locals.userEmail = "";
    }

    //res.locals.userEmail = req.user ? req.user.email : "";

    //res.locals.title = "Anuncios";
    const docs = await Anuncio.listar(null, 0, 10); //Solo muestra los 10 primeros elementos

    if (docs.length === 0) {
      res.locals.titleList = res.__("Lista vacía");
    } else {
      res.locals.titleList = res.__("Lista de anuncios") + ": " + docs.length;
    }

    //Calculo la ruta de la imagen
    docs.forEach(element => {
      if (element.precargado === true) {
        element.ruta = "/images/anuncios/" + element.foto;
      } else {
        element.ruta = "/images/uploads/";
        if (element.thumbnail === "") {
          element.ruta += element.foto;
        } else {
          element.ruta += element.thumbnail;
        }
      }
    });

    res.locals.adsList = docs;
    console.log("res.locals.adsList", res.locals.adsList.length);
    res.render("index");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

module.exports = router;
