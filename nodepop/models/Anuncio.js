"use strict";

const mongoose = require("mongoose");

// primero definimos un esquema
const anuncioSchema = mongoose.Schema({
  nombre: String,
  venta: Boolean,
  precio: Number,
  foto: String,
  thumbnail: String,
  tags: [String],
  //precargado. Se utiliza para separar en diferentes carpetas las imágenes:
  //True. Anuncios cargados por defecto en installDB. No contienen thumbnail. public/images/anuncios
  //False. Nuevos anuncios creados dinámicamente. Microservicio genera thumbnail. public/images/uploads
  //Así, con .gitignore solo se suben las imágenes predefinidas
  precargado: Boolean
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

// creamos un método estático (del modelo)
anuncioSchema.statics.insertar = function(anuncio, callback) {
  return Anuncio.insertMany(anuncio);
};

// creamos un método estático (del modelo)
anuncioSchema.statics.actualizar = function(anuncio, callback) {
  return Anuncio.updateOne(
    { _id: anuncio.id },
    { $set: { thumbnail: anuncio.thumbnail } }
  );
};

// creamos el modelo
const Anuncio = mongoose.model("Anuncio", anuncioSchema);

// exportamos el modelo
module.exports = Anuncio;
