"use strict";

const cote = require("cote");

// cliente de creación de thumbnail de imágenes

const requester = new cote.Requester({ name: "thumbnail client" });

const Anuncio = require("../models/Anuncio");

module.exports = function(id, path, image) {
  requester.send(
    {
      type: "createThumbnail", // quienquiera que escuche peticiones 'convert'
      id: id,
      path: path,
      image: image
    },
    async res => {
      console.log(`client recibe: ${res.id} - ${res.image}`, Date.now());

      const anuncio = {
        id: res.id,
        thumbnail: res.image
      };

      const response = await Anuncio.actualizar(anuncio);
      //onsole.log("responseUpdate", response);
    }
  );
};
