"use strict";

const express = require("express");
const router = express.Router();

const Anuncio = require("../../models/Anuncio");

/**
 * @api {get} /anuncios Get ads list
 * @apiVersion 1.0.0
 * @apiName GetAds
 * @apiGroup Ads
 *
 * @apiParam {Object[]} [request]  List of request params.
 * @apiParam {String} [request.nombre] Equal to name (property filter).
 * @apiParam {Boolean} [request.venta] Equal ad to Sell or to buy (property filter).
 * @apiParam {Number="n-m","n-","-n","n"} [request.precio] range of prices (property filter).
 * @apiParam {String} [request.tag] Equal to ad tag (property filter).
 * @apiParam {String} [request.start] filter n firsts ads (page filter).
 * @apiParam {String} [request.limit] get n first ads (page filter).
 * @apiParam {String="property (asc)","-property (desc)"} [request.sort] order by property (page filter).
 * @apiParam {String[]="property", "property-1 property-n"} [request.fields] select properties to show (page filter).
 *
 * @apiSuccess {Boolean} success Response operation value.
 * @apiSuccess {Object[]} result  List of ads information.
 * @apiSuccess {Number} result._id Ad unique identifier.
 * @apiSuccess {String} result.nombre Ad name.
 * @apiSuccess {Boolean} result.venta Ad to Sell or to buy.
 * @apiSuccess {Number} result.precio Ad price.
 * @apiSuccess {String} result.foto Ad photo path.
 * @apiSuccess {String[]} result.tags List of ad tags.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *        "success": "true",
 *        "result": {
 *            "_id": "5a87150e06d8313cc803da15",
 *            "nombre": "Bicicleta",
 *            "venta": "true",
 *            "precio": "230.15",
 *            "foto": "bici.jpg",
 *            "tags": {
 *                "lifestyle",
 *                "motor"
 *            }
 *        }
 *     }]
 *
 * @apiErrorExample {json} Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/", async (req, res, next) => {
  //GET. Obtener anuncios por filtro
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

    const filter = {};

    if (typeof nombre !== "undefined") {
      // si me piden filtrar por nombre...
      filter.nombre = new RegExp("^" + nombre, "i");
    }

    if (typeof venta !== "undefined") {
      // si me piden filtrar por venta (o se busca)...
      filter.venta = venta; // lo añado al filtro
    }

    if (typeof precio !== "undefined") {
      // si me piden filtrar por precio
      const isEqualParam = /^\d+$/.test(precio);
      if (isEqualParam) {
        filter.precio = precio; // lo añado al filtro
      } else {
        const isLessParam = /^\-\d+$/.test(precio);
        if (isLessParam) {
          filter.precio = { $lt: precio * -1 };
        } else {
          const isGreaterParam = /^\d+\-$/.test(precio);
          if (isGreaterParam) {
            filter.precio = { $gt: precio.substring(0, precio.length - 1) };
          } else {
            const isRangeParam = /^\d+\-\d+$/.test(precio);
            if (isRangeParam) {
              const array = precio.split("-");
              filter.precio = { $gte: array[0], $lte: array[1] };
            }
          }
        }
      }
    }

    if (typeof tag !== "undefined") {
      //si me piden filtrar por tag...
      filter.tags = tag; // lo añado al filtro
    }

    // Si usamos await, la función en donde estoy debe tener async
    const docs = await Anuncio.listar(filter, skip, limit, sort, fields);
    res.json({ success: true, result: docs }); // Lo metemos en una propiedad del objeto
  } catch (err) {
    console.log(err);
    next(err);
    return;
  }
});

/**
 * @api {get} /anuncios/:id Get ad by Id
 * @apiVersion 1.0.0
 * @apiName GetAd
 * @apiGroup Ads
 *
 * @apiParam {Number} id Ads unique Id.
 *
 * @apiSuccess {Boolean} success Response operation value.
 * @apiSuccess {Object[]} result  List of ads information.
 * @apiSuccess {Number} result._id Ad unique identifier.
 * @apiSuccess {String} result.nombre Ad name.
 * @apiSuccess {Boolean} result.venta Ad to Sell or to buy.
 * @apiSuccess {Number} result.precio Ad price.
 * @apiSuccess {String} result.foto Ad photo.
 * @apiSuccess {String[]} result.tags List of ad tags.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *        "success": "true",
 *        "result": {
 *            "_id": "5a87150e06d8313cc803da15",
 *            "nombre": "Bicicleta",
 *            "venta": "true",
 *            "precio": "230.15",
 *            "foto": "bici.jpg",
 *            "tags": {
 *                "lifestyle",
 *                "motor"
 *            }
 *        }
 *     }
 *
 *
 * @apiErrorExample {json} Not Found
 *     HTTP/1.1 404 Not Found
 *     {
 *        "success": "false",
 *        "error": "AdsNotFound"
 *     }
 * @apiErrorExample {json} Server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get("/:id", async (req, res, next) => {
  //GET. Obtener un anuncio
  try {
    const _id = req.params.id;
    const doc = await Anuncio.findById(_id).exec();
    res.json({ success: true, result: doc });
  } catch (err) {
    next(err);
    return;
  }
});

/**
 * @api {post} /anuncios Create new ad
 * @apiVersion 1.0.0
 * @apiName PostAd
 * @apiGroup Ads
 *
 * @apiParam {String} nombre Ad name.
 * @apiParam {Boolean} venta Ad to Sell or to buy.
 * @apiParam {Number} precio Ad price.
 * @apiParam {String} foto Ad photo path.
 * @apiParam {String[]="work","lifestyle","motor","mobile"} tags List of ad tags.
 *
 * @apiSuccess {Boolean} success Response operation value.
 * @apiSuccess {Object[]} result  List of ads information.
 * @apiSuccess {Number} result._id Ad unique identifier.
 * @apiSuccess {String} result.nombre Ad name.
 * @apiSuccess {Boolean} result.venta Ad to Sell or to buy.
 * @apiSuccess {Number} result.precio Ad price.
 * @apiSuccess {String} result.foto Ad photo path.
 * @apiSuccess {String[]} result.tags List of ad tags.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     [{
 *        "success": "true",
 *        "result": {
 *            "_id": "5a87150e06d8313cc803da15",
 *            "nombre": "Bicicleta",
 *            "venta": "true",
 *            "precio": "230.15",
 *            "foto": "bici.jpg",
 *            "tags": {
 *                "lifestyle",
 *                "motor"
 *            }
 *        }
 *     }]
 *
 * @apiErrorExample {json} Server Error
 *    HTTP/1.1 500 Internal Server Error
 */
router.post("/", async (req, res, next) => {
  //POST. Añadir un anuncio
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

/**
 * @api {delete} /anuncios/:id Remove ad by Id
 * @apiVersion 1.0.0
 * @apiName DeleteAd
 * @apiGroup Ads
 *
 * @apiParam {Number} id Ads unique Id.
 *
 * @apiSuccess {Boolean} success Response operation value.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *        "success": "true",
 *     }
 *
 * @apiErrorExample {json} Server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.delete("/:id", async (req, res, next) => {
  //DELETE. Elimina un anuncio
  try {
    const _id = req.params.id;
    await Anuncio.remove({ _id: _id }).exec();
    res.json({ success: true });
  } catch (err) {
    next(err);
    return;
  }
});

/**
 * @api {put} /anuncios/:id Update ad by Id
 * @apiVersion 1.0.0
 * @apiName PutAd
 * @apiGroup Ads
 *
 * @apiParam {Number} id Ads unique Id.
 * @apiParam {String} [nombre] Ad name.
 * @apiParam {Boolean} [venta] Ad to Sell or to buy.
 * @apiParam {Number} [precio] Ad price.
 * @apiParam {String} [foto] Ad photo path.
 * @apiParam {String[]="work","lifestyle","motor","mobile"} [tags] List of ad tags.
 *
 * @apiSuccess {Boolean} success Response operation value.
 * @apiSuccess {Object[]} result  List of ads information.
 * @apiSuccess {Number} result._id Ad unique identifier.
 * @apiSuccess {String} result.nombre Ad name.
 * @apiSuccess {Boolean} result.venta Ad to Sell or to buy.
 * @apiSuccess {Number} result.precio Ad price.
 * @apiSuccess {String} result.foto Ad photo path.
 * @apiSuccess {String[]} result.tags List of ad tags.
 *
 * @apiSuccessExample {json} Success
 *     HTTP/1.1 200 OK
 *     {
 *        "success": "true",
 *        "result": {
 *            "_id": "5a87150e06d8313cc803da15",
 *            "nombre": "Bicicleta",
 *            "venta": "true",
 *            "precio": "230.15",
 *            "foto": "bici.jpg",
 *            "tags": {
 *                "lifestyle",
 *                "motor"
 *            }
 *        }
 *     }
 *
 * @apiErrorExample {json} Server error
 *    HTTP/1.1 500 Internal Server Error
 */
router.put("/:id", async (req, res, next) => {
  //PUT. Actualiza un anuncio
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
