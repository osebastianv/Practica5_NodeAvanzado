var express = require("express");
var router = express.Router();

const Anuncio = require("../models/Anuncio");

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

module.exports = router;
