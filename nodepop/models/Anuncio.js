"use strict";

const mongoose = require("mongoose");

// primero definimos un esquema
const anuncioSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  tags: [String]
});

// creamos un método estático (del modelo)
anuncioSchema.statics.listar = function(
  filter,
  skip,
  limit,
  sort,
  fields,
  callback
) {
  // obtenemos la query sin ejecutarla
  const query = Anuncio.find(filter);
  query.skip(skip);
  query.limit(limit);
  query.sort(sort);
  query.select(fields);
  return query.exec(callback);
};

// creamos el modelo
const Anuncio = mongoose.model("Anuncio", anuncioSchema);

// exportamos el modelo
module.exports = Anuncio;
