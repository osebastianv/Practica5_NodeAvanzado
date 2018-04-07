/*
 * Script que se encarga de crear la base de datos
 *
 */
"use strict";

// conectamos la base de datos
const conn = require("../lib/connectMongoose");
// cargamos los modelos para que mongoose los conozca
const Anuncio = require("../models/Anuncio");
const Usuario = require("../models/Usuario");

const fs = require("fs");

conn.once("open", async () => {
  try {
    await initAdvertisements();
    await initUsers();
    conn.close();
  } catch (err) {
    console.log("Hubo un error:", err);
    process.exit(1);
  }
});

async function initAdvertisements() {
  const deleted = await Anuncio.deleteMany();
  console.log(`Eliminados ${deleted.n} anuncios.`);

  const data = fs.readFileSync(
    "./public/files/anuncios/anuncios.json",
    "utf-8"
  );
  const anuncios = JSON.parse(data);
  const inserted = await Anuncio.insertMany(anuncios);
  console.log(`Insertados ${inserted.length} anuncios.`);
}

async function initUsers() {
  const deleted = await Usuario.deleteMany();
  console.log(`Eliminados ${deleted.n} usuarios.`);

  const inserted = await Usuario.insertMany([
    {
      name: "user",
      email: "user@example.com",
      password: await Usuario.hashPassword("1234")
    }
  ]);
  console.log(`Insertados ${inserted.length} usuarios.`);
}
