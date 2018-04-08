"use strict";

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

    const docs = await Anuncio.listar(null, 0, 100); //Solo muestra los 100 primeros elementos

    if (docs.length === 0) {
      res.locals.titleList = res.__("Lista vacía");
    } else {
      res.locals.titleList = res.__("Lista de anuncios") + ": " + docs.length;
    }

    //Calculo la ruta de la imagen
    docs.forEach(element => {
      //Foto precargada:
      //False. Las imágenes de los anuncios guardados dinamicamente empiezan por imagen-
      //True. Las imágenes cargadas en el fichero json usando el scrip installDB no empiezan por imagen-
      //Se guardan en diferentes carpetas, así las imágenes de anuncios dinámicos se filtran por .gitignore
      const n = element.foto.indexOf("imagen-");
      element.precargado = n === 0 ? false : true; //deben empezar por imagen-

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
    res.render("index");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

module.exports = router;
