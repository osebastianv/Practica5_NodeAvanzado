/*
 * Script que se encarga de crear la base de datos
 *
 */
"use strict";

// conectamos la base de datos
const mongoose = require("./lib/connectMongoose");
// cargamos los modelos para que mongoose los conozca
const Anuncio = require("./models/Anuncio");

const fs = require("fs");

mongoose.connectDataBase(() => {
  installDataBase();
});

async function installDataBase() {
  try {
    //1. Borramos datos tabla
    await removeAdvertisements();
    console.log("Datos borrados correctamente");

    //2. Insertamos datos tabla desde fichero json
    await createAdvertisements();
    console.log("Datos insertados correctamente");
    process.exit(0);
  } catch (err) {
    console.log("Error al instalar la base de datos", err);
    process.exit(1);
  }
}

function removeAdvertisements() {
  return Anuncio.deleteMany().exec();
}

function createAdvertisements() {
  const data = fs.readFileSync(
    "./public/files/anuncios/anuncios.json",
    "utf-8"
  );
  const anuncios = JSON.parse(data);
  return Anuncio.insertMany(anuncios);
}
