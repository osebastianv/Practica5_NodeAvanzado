"use strict";

const express = require("express");
const router = express.Router();

const Anuncio = require("../../models/Anuncio");

//GET
// Obtener anuncios por filtro
router.get("/", async (req, res, next) => {
  try {
    // recogemos parámetros de entrada
    const nombre = req.query.nombre;
    const venta = req.query.venta;
    const precio = req.query.precio;
    const tag = req.query.tag;

    const skip = parseInt(req.query.start);
    const limit = parseInt(req.query.limit);
    const sort = req.query.sort;
    const fields = req.query.fields;

    console.log(req.query);

    const filter = {};

    if (typeof nombre !== "undefined") {
      // si me piden filtrar por nombre...
      filter.nombre = nombre; // lo añado al filtro
    }

    if (typeof venta !== "undefined") {
      // si me piden filtrar por venta (o se busca)...
      filter.venta = venta; // lo añado al filtro
    }

    if (typeof precio !== "undefined") {
      // si me piden filtrar por precio...
      filter.precio = precio; // lo añado al filtro
    }

    if (typeof tag !== "undefined") {
      //si me piden filtrar por tag...
      filter.tags = tag; // lo añado al filtro
    }

    console.log("Inicio");

    // Si usamos await, la función en donde estoy debe tener async
    const docs = await Anuncio.listar(filter, skip, limit, sort, fields);

    console.log("Fin");

    //throw new Error("Fallo tremendo");
    res.json({ success: true, result: docs }); // Lo metemos en una propiedad del objeto
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

// Obtener un anuncio
router.get("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const doc = await Anuncio.findById(_id);
    res.json({ success: true, result: doc });
  } catch (err) {
    next(err);
    return;
  }
});

// POST
// Añadir un anuncio
router.post("/", async (req, res, next) => {
  try {
    const data = req.body;
    const anuncio = new Anuncio(req.body);
    const anuncioGuardado = await anuncio.save();
    res.json({ success: true, result: anuncioGuardado });
  } catch (err) {
    next(err);
    return;
  }
});

// DELETE /
// Elimina un anuncio
router.delete("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    await Anuncio.remove({ _id: _id }).exec();
    res.json({ success: true });
  } catch (err) {
    next(err);
    return;
  }
});

// PUT /
// Actualiza un anuncio
router.put("/:id", async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    const anuncioActualizado = await Anuncio.findByIdAndUpdate(_id, data, {
      new: true // esto es para obtener la nueva versión del documento tras actualizarlo
    });
    res.json({ success: true, result: anuncioActualizado });
  } catch (err) {
    next(err);
    return;
  }
});

module.exports = router;
