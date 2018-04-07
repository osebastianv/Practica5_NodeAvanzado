"use strict";

const multer = require("multer");
const path = require("path");

// Multer upload config
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/uploads"));
  },
  filename: function(req, file, cb) {
    //console.log("file.originalname", file.originalname);
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
  }
});

module.exports = multer({ storage: storage });
