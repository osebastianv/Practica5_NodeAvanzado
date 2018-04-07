var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

const jwtAuth = require("./lib/jwtAuth");

// conectamos la base de datos
const conn = require("./lib/connectMongoose");
// cargamos los modelos para que mongoose los conozca
const Anuncio = require("./models/Anuncio");
//const Usuario = require("./models/Usuario");

var index = require("./routes/index");
var newAd = require("./routes/newAd");
var lang = require("./routes/lang");
//var users = require("./routes/users");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html"); // decimos a express que use extension html
app.engine("html", require("ejs").__express); // le decimos como manejar vistas html

app.locals.title = "NodePOP";

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Configuramos multiidioma en express
const i18n = require("./lib/i18nConfigure")();
app.use(i18n.init);

const loginController = require("./routes/loginController");

// middleware de control de sesiones
app.use(
  session({
    name: "nodepop-session",
    secret: "palabrasecretaindescifrable",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 2 * 24 * 60 * 60 * 1000, httpOnly: true }, // dos dias de inactividad
    store: new MongoStore({
      // como conectarse a mi base de datos
      url: "mongodb://localhost/nodepopDB" // fix issue https://github.com/jdesboeufs/connect-mongo/issues/277
      // mongooseConnection: conn
    })
  })
);

// Add headers to connect external website
app.use(function(req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});

app.use("/lang", lang);

app.get("/login", loginController.index);
app.post("/login", loginController.postLoginJWT);
app.get("/logout", loginController.logout);

app.use("/apiv1/anuncios", jwtAuth(), require("./routes/apiv1/anuncios"));

app.use("/", jwtAuth(), index);
app.use("/newAd", jwtAuth(), newAd);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (err.array) {
    // validation error
    err.status = 422;
    const errInfo = err.array({ onlyFirstError: true })[0];
    err.message = `Not valid - ${errInfo.param} ${errInfo.msg}`;
  }

  res.status(err.status || 500);

  // Si es una petición de API, respondemos con JSON

  // Respondo con una página de error
  if (isAPI(req)) {
    res.json({ success: false, error: err.message });
    return;
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.render("error");
});

function isAPI(req) {
  //Console.log(req);
  return req.originalUrl.indexOf("/apiv") === 0;
}

module.exports = app;
