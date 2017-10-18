require("dotenv").config();
var request = require("request");
var uid2 = require("uid2");
var mongoose = require("mongoose");
var _ = require("lodash");
var jsonfile = require("jsonfile");
var jsonFailedRequests = "./save/tmp/failedRequests.json";
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) {
    console.error("Could not connect to mongodb.");
  }
});

var User = require("../models/User.js");
var AllocineMovie = require("../models/AllocineMovie.js");

var users = require("./users.json");
var failedRequests = [];
var i = 1;

users.forEach(function(user) {
  AllocineMovie.find(
    { code: { $in: user.account.favorites } },
    function(err, movies) {
      if (err) {
        console.log(err);
      } else {
        User.register(
          new User({
            email: user.account.username.toLowerCase() + "@moveet.com",
            token: uid2(16),
            account: {
              username: user.account.username,
              favorites: movies,
              age: user.account.age,
              description: user.account.description,
              genre: user.account.genre,
              subscription: user.account.subscription,
              picture: user.account.picture,
              location: user.account.location
            }
          }),
          "password01", // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
          function(err, obj) {
            if (err) {
              console.error(err);
              console.log("erreur dans le save");
            } else {
              console.log(
                "saved user " + obj.account.username,
                i,
                " out of",
                users.length
              );
              i++;
            }
            if (i === users.length - 1) {
              console.log("stop");
              setTimeout(
                function() {
                  console.log("c'est fini");
                  mongoose.connection.close();
                },
                15000
              );
            }
          }
        );
      }
    }
  );
});
