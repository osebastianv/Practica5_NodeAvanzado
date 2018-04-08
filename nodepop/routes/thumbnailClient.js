"use strict";

const cote = require("cote");

// cliente de creación de thumbnail de imágenes

const requester = new cote.Requester({ name: "thumbnail client" });

const Anuncio = require("../models/Anuncio");

module.exports = function(id, mimetype, path, image) {
  console.log("aqui", path);
  requester.send(
    {
      type: "createThumbnail", // quienquiera que escuche peticiones 'convert'
      id: id,
      mimetype: mimetype,
      path: path,
      image: image
    },
    async res => {
      console.log(
        `client recibe: ${res} - ${res.id} - ${res.image}`,
        Date.now()
      );

      const anuncio = {
        id: res.id,
        thumbnail: res.image
      };
      //console.log("3", anuncio);

      const response = await Anuncio.actualizar(anuncio);
      console.log("responseUpdate", response);
    }
  );
};
