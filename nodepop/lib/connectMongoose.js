"use strict";

const mongoose = require("mongoose");

function connectDataBase(callback) {
  const conn = mongoose.connection;

  conn.on("Error", err => {
    console.log("Error de conexión", err);
    process.exit(1);
  });

  conn.once("open", () => {
    console.log("Conectado a MongoDB en", mongoose.connection.name);
    callback();
  });

  mongoose.connect("mongodb://localhost/nodepopDB");
}

module.exports = { connectDataBase };

/*(async () => {
  return new Promise((resolve, reject) => {
    const conn = mongoose.connection;

    conn.on("Error", err => {
      reject(new error("Error de conexión", err));
    });

    conn.once("open", () => {
      console.log("Conectado a MongoDB en", mongoose.connection.name);
      resolve();
    });
  });

  await mongoose.connect("mongodb://localhost/nodepopDB");
})().catch(err => {
  console.log(err);
  process.exit(1);
});*/