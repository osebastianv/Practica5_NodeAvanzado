var express = require("express");
var router = express.Router();

const Anuncio = require("../models/Anuncio");

// cargamos objeto de upload
const upload = require("../lib/uploadConfig");

/* GET home page. */
router.get("/", async function(req, res, next) {
  try {
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
    //res.locals.adsList = [];
    //console.log("algos", res.locals.adsList.length);
    res.redirect("/");
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

module.exports = router;
