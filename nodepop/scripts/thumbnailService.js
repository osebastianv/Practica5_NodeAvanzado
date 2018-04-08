"use strict";

// Servicio de creación de thumbnail de imágenes

const cote = require("cote");
const jimp = require("jimp");
const path = require("path");

const responder = new cote.Responder({ name: "thumbnail responder" });

// req: { path: '/images/uploads/bici.jpg', foto: 'bici.jpg' }
responder.on("createThumbnail", (req, done) => {
  try {
    console.log(
      "servicio: petición de",
      req.id,
      req.mimetype,
      req.path,
      req.image,
      Date.now()
    );

    const type = req.mimetype.split("/");

    //const name = path.parse(req.image).name; // hello
    const ext = path.parse(req.image).ext; // .html

    const result = {
      id: req.id,
      image: req.image + "-small3." + ext //type[1]
    };

    // open a file called "lenna.png"
    jimp.read(req.path + "/" + req.image, function(err, imageSmall) {
      if (err) throw err;
      imageSmall
        .resize(100, 100) // resize
        //.quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .write(req.path + "/" + result.image); // save
    });

    done(result);
  } catch (error) {}
});
