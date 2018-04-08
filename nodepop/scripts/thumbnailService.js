"use strict";

// Servicio de creación de thumbnail de imágenes

const cote = require("cote");
const jimp = require("jimp");
const path = require("path");

const responder = new cote.Responder({ name: "thumbnail responder" });

// req: { id: 'id del registro en mongo', path: ruta de la imagen', image: 'nombre de la imagen' }
responder.on("createThumbnail", (req, done) => {
  try {
    console.log(
      "servicio: petición de",
      req.id,
      req.path,
      req.image,
      Date.now()
    );

    const name = path.parse(req.image).name;
    const ext = path.parse(req.image).ext;

    const result = {
      id: req.id,
      image: name + "-small" + ext
    };

    // open a file called "name"
    jimp.read(req.path + "/" + req.image, function(err, imageSmall) {
      if (err) throw err;
      imageSmall
        .resize(100, 100) // resize
        .greyscale() // set greyscale
        .write(req.path + "/" + result.image); // save
    });

    done(result);
  } catch (error) {}
});
