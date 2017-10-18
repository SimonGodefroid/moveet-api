var express = require("express");
var router = express.Router();
var Theater = require("../models/Theater.js");
var request = require("request");

//http://localhost:3002/api/theaters/all-theaters
router.get("/all-theaters", function(req, res, next) {
  Theater.find({}).exec(function(err, theaters) {
    if (err) {
      console.log("An error occurred" + err);
    } else {
      res.json({
        theaters: theaters
      });
    }
  });
});

//http://api.allocine.fr/rest/v3/theaterlist?partner=YW5kcm9pZC12Mg&zip=75000&radius=2000&count=3000&format=json
// http://localhost:3002/api/theaters/all-theaters
router.get("/theaterlist/", function(req, res, next) {
  request(
    "http://api.allocine.fr/rest/v3/theaterlist?partner=YW5kcm9pZC12Mg&lat=" +
      req.query.lat +
      "&long=" +
      req.query.long +
      "&radius=20&count=100&format=json",
    function(error, response, body) {
      var result = JSON.parse(body);
      console.log("error:", error); // Print the error if one occurred
      console.log("statusCode:", response && response.statusCode); // Print the response status code if a response was received
      console.log("body:", body); // Print the HTML for the Google homepage.
      res.json({
        theaters: result.feed.theater
      });
    }
  );
});

// http://localhost:3002/api/movies/all-movies
router.get("/all-movies", function(req, res, next) {
  AllocineMovie.find({})
    .sort({ "release.releasDate": "ascending" })
    .exec(function(err, movies) {
      if (err) {
        console.log("An error occurred" + err);
      } else {
        res.json({
          total: movies.length,
          movies: movies
        });
      }
    });
});

router.get("/showtimes", function(req, res, next) {
  allocine.api(
    "showtimelist",
    {
      movie: req.query.movie,
      count: !req.query.count ? 20 : req.query.count,
      lat: req.query.lat,
      long: req.query.long,
      radius: 3
    },
    function(error, results) {
      if (error) {
        console.log("Error : " + error);
        return;
      }
      //console.log("horaires pour le film avec id", req.query.movie);
      console.log(req.query.lat);
      //console.log(results);
      res.json({
        showtimes: results
      });
    }
  );
});

module.exports = router;
