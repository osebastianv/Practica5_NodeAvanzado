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

    //res.locals.userEmail = req.user ? req.user.email : "";

    res.render("newAd");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

router.post("/", upload.single("imagen"), async function(req, res, next) {
  try {
    console.log("upload:", req.file);
    console.log("body:", req.body);

    if (checkAd(req.body, req.file) === false) {
      const err = new Error("Falta información en la petición");
      err.status = 400;
      next(err);
      return;
    }

    //console.log("1", req.body.tags);

    let arrayTags = [];
    if (Array.isArray(req.body.tags) === true) {
      arrayTags = req.body.tags;
    } else {
      arrayTags.push(req.body.tags);
    }
    //console.log("2", arrayTags);

    const anuncio = {
      nombre: req.body.nombre,
      venta: req.body.venta,
      precio: req.body.precio,
      foto: req.file.filename,
      thumbnail: "",
      tags: arrayTags,
      precargado: false
    };
    //console.log("3", anuncio);

    const response = await Anuncio.insertar(anuncio);
    console.log("response", response);
    console.log("response.id", response[0]._id);

    thumbnailClient(
      response[0]._id,
      req.file.mimetype,
      req.file.destination,
      req.file.filename
    );

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
  //console.log("nombre", nombre);

  const precio = body.precio;
  if (precio === undefined) {
    return false;
  }
  //console.log("precio", precio);

  const venta = body.venta;
  if (venta === undefined) {
    return false;
  }
  //console.log("venta", venta);

  const tags = body.tags;
  if (tags === undefined) {
    return false;
  }
  //console.log("tags", tags);

  const foto = file;
  //console.log("foto", foto);
  if (foto === undefined) {
    return false;
  }
  //console.log("foto", foto);

  return true;
}

module.exports = router;
