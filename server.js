// Le package `dotenv` permet de pouvoir definir des variables d'environnement dans le fichier `.env`
// Nous utilisons le fichier `.slugignore` afin d'ignorer le fichier `.env` dans l'environnement Heroku
require("dotenv").config();

// Le package `mongoose` est un ODM (Object-Document Mapping) permettant de manipuler les documents de la base de données comme si c'étaient des objets
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function (err) {
  // paramètre qui vient de dotenv
  if (err) console.error("Could not connect to mongodb.");
});

var express = require("express");
var app = express();
app.use(express.static("public"));

// Le package `helmet` est une collection de protections contre certaines vulnérabilités HTTP
var helmet = require("helmet");
app.use(helmet());

// Les réponses (> 1024 bytes) du serveur seront compressées au format GZIP pour diminuer la quantité d'informations transmise
var compression = require("compression");
app.use(compression());

// Parse le `body` des requêtes HTTP reçues
var bodyParser = require("body-parser");
//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));


// Initialisation des models
//var Movies = require("./models/_Movie");
var AllocineMovies = require("./models/AllocineMovie");
var User = require("./models/User");

// Le package `passport`
var passport = require("passport");
app.use(passport.initialize()); // TODO test

// Nous aurons besoin de 2 strategies :
// - `local` permettra de gérer le login nécessitant un mot de passe
var LocalStrategy = require("passport-local").Strategy;
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passReqToCallback: true,
      session: false
    },
    User.authenticateLocal()
  )
);

app.get("/", function (req, res) {
  res.render(index);
});

// `Cross-Origin Resource Sharing` est un mechanisme permettant d'autoriser les requêtes provenant d'un nom de domaine different
// Ici, nous autorisons l'API à repondre aux requêtes AJAX venant d'autres serveurs
var cors = require("cors");
app.use("/api", cors());

// Les routes sont séparées dans plusieurs fichiers
var moviesRoutes = require("./routes/movies.js");
var usersRoutes = require("./routes/users.js");
var movieRoutes = require("./routes/movie.js");
var userRoutes = require("./routes/user.js");
var theatersRoutes = require("./routes/theaters.js");
// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`
app.use("/api/movies", moviesRoutes);
app.use("/api/movie", movieRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/user", userRoutes);
app.use("/api/theaters", theatersRoutes);

// Les routes sont séparées dans plusieurs fichiers
// Les routes relatives aux utilisateurs auront pour prefix d'URL `/user`

// Toutes les méthodes HTTP (GET, POST, etc.) des pages non trouvées afficheront une erreur 404
app.all("*", function (req, res) {
  res.status(404).json({
    error: "Not Found"
  });
});

// Le dernier middleware de la chaîne gérera les d'erreurs
// Ce `error handler` doit définir obligatoirement 4 paramètres
// Définition d'un middleware : https://expressjs.com/en/guide/writing-middleware.html
app.use(function (err, req, res, next) {
  if (res.statusCode === 200) res.status(400);
  console.error(err);

  if (process.env.NODE_ENV === "production") err = "An error occurred";
  res.json({
    error: err
  });
});

app.listen(process.env.PORT, function () {
  console.log(`Moveet API running on port ${process.env.PORT}`);
  //console.log("Moveet API process.env", process.env);
});

// for local dev only
// app.listen(3000, function() {
//   console.log(`Moveet API running on port 3000`);
//   //console.log("Moveet API process.env", process.env);
// });

// TODO test
// console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV}`);
