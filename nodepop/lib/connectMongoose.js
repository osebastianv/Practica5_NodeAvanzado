"use strict";

const mongoose = require("mongoose");

function connectDataBase() {
  return new Promise((resolve, reject) => {
    const conn = mongoose.connection;

    conn.on("error", err => {
      reject(new error("Error de conexión", err));
    });

    conn.once("open", () => {
      console.log("Conectado a MongoDB en", mongoose.connection.name);
      resolve();
    });

    mongoose.connect("mongodb://localhost/nodepopDB");
  });
}

function disconnectDataBase() {
  return mongoose.connection.close();
}

module.exports = {
  connectDataBase: connectDataBase,
  disconnectDataBase: disconnectDataBase
};
