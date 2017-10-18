require("dotenv").config();

var uid2 = require("uid2");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) {
    console.error("Could not connect to mongodb.");
  }
});

var Theater = require("../models/Theater.js");
var allMovieTheaters = require("../save/tmp/allMovieTheaters.json");
let ids = [];

allMovieTheaters.forEach(function(theater) {
  if (ids.indexOf(theater.code) === -1) {
    ids.push(theater.code);

    var data = new Theater({
      code: theater.code,
      name: theater.name,
      address: theater.address,
      postalCode: theater.postalCode,
      city: theater.city,
      area: theater.area,
      cinemaChain: {
        code: theater.cinemaChain ? theater.cinemaChain.code : "",
        value: theater.cinemaChain ? theater.cinemaChain.$ : ""
      },
      screenCount: theater.screenCount,
      geoloc: {
        lat: theater.geoloc.lat,
        long: theater.geoloc.long
      },
      picture: {
        path: theater.picture ? theater.picture.path : "",
        href: theater.picture ? theater.picture.href : ""
      },
      hasEvent: theater.hasEvent,
      hasPRMAccess: theater.hasPRMAccess,
      openToExternalSales: theater.openToExternalSales,
      link: [
        {
          rel: theater.link[0].rel,
          href: theater.link[0].href
        }
      ]
    });
    var theater = new Theater(data);
    theater.save(function(err, obj) {
      if (err) {
        console.log("error saving theater");
      } else {
        //console.log("saved movie");
      }
    });
  } else {
    console.log("doublon");
  }
});

setTimeout(
  function() {
    mongoose.connection.close();
  },
  15000
);
