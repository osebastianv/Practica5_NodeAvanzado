var express = require("express");
var router = express.Router();

const Anuncio = require("../models/Anuncio");

/* GET home page. */
router.get("/", async function(req, res, next) {
  try {
    res.locals.title = "Anuncios";
    const docs = await Anuncio.listar(null, 0, 10); //Solo muestra los 10 primeros elementos
    res.locals.adsList = docs;
    res.render("index");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

module.exports = router;
