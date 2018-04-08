"use strict";

var express = require("express");
var router = express.Router();

const Anuncio = require("../models/Anuncio");
const Usuario = require("../models/Usuario");

// cargamos objeto de upload
const upload = require("../lib/uploadConfig");
const thumbnailClient = require("./thumbnailClient");

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

    res.render("newAd");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

router.post("/", upload.single("imagen"), async function(req, res, next) {
  try {
    console.log("req.body", req.body);
    console.log("req.file", req.file);

    //Comprobar formato de datos de entrada
    if (checkAd(req.body, req.file) === false) {
      const err = new Error("Falta información en la petición");
      err.status = 400;
      next(err);
      return;
    }

    //Si es un solo elemento, se debe convertir en array
    let arrayTags = [];
    if (Array.isArray(req.body.tags) === true) {
      arrayTags = req.body.tags;
    } else {
      arrayTags.push(req.body.tags);
    }

    const anuncio = {
      nombre: req.body.nombre,
      venta: req.body.venta,
      precio: req.body.precio,
      foto: req.file.filename,
      thumbnail: "",
      tags: arrayTags
    };

    const response = await Anuncio.insertar(anuncio);

    //Solicitar al microservicio la creación del thumbnail de la imagen (disminuir a 100x100 px)
    thumbnailClient(response[0]._id, req.file.destination, req.file.filename);

    res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

function checkAd(body, file) {
  const nombre = body.nombre;
  if (nombre === undefined) {
    return false;
  }

  const precio = body.precio;
  if (precio === undefined) {
    return false;
  }

  const venta = body.venta;
  if (venta === undefined) {
    return false;
  }

  const tags = body.tags;
  if (tags === undefined) {
    return false;
  }

  const foto = file;
  if (foto === undefined) {
    return false;
  }

  return true;
}

module.exports = router;
