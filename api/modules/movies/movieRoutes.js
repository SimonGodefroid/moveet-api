var express = require("express");
var router = express.Router();
var AllocineMovie = require("../models/AllocineMovie.js");
var User = require("../models/User.js");
var request = require("request");
var allocine = require("../services/AllocineShowTimes");

// PROD
// Route pour tous les films d'un genre
// http://localhost:3002/api/movies/?genre=

router.get("/", function(req, res, next) {
  if (!req.query.genre) {
    return next("Genre is mandatory");
  } else if (!req.query.type) {
    AllocineMovie.find({
      $and: [
        {
          genreListSimon: { $in: [parseInt(req.query.genre)] },
          media: { $ne: "nothing here" }
        }
      ]
    })
      .sort({ "statistics.theaterCount": "descending" })
      .sort({ "release.releaseDate": "ascending" })
      .exec(function(err, movies) {
        if (err) {
          console.log("An error occurred" + err);
        } else {
          res.json({
            genre: req.query.genre,
            total: movies.length,
            movies: movies
          });
        }
      });
  } else {
    AllocineMovie.find({
      $and: [
        { genreListSimon: { $in: [parseInt(req.query.genre)] } },
        { statusList: { $in: [req.query.type] } }
      ]
    })
      .sort({ "statistics.theaterCount": "descending" })
      .sort({ "release.releasDate": "ascending" })
      .sort({ statusList: "descending" })
      .exec(function(err, movies) {
        if (err) {
          console.log("An error occurred" + err);
        } else {
          res.json({
            genre: req.query.genre,
            total: movies.length,
            movies: movies
            //week: movies[0].release_date
          });
        }
      });
  }
});

router.get("/sorted", function(req, res, next) {
  if (!req.query.genre) {
    return next("Genre is mandatory");
  } else if (!req.query.statusList) {
    AllocineMovie.find({
      $and: [
        {
          genreListSimon: { $in: [parseInt(req.query.genre)] },
          media: { $ne: "nothing here" },
          statusList: { $in: ["comingsoon"] }
        }
      ]
    })
      .sort({ "statistics.theaterCount": "descending" })
      .sort({ "release.releaseDate": "ascending" })
      .exec(function(err, comingSoonMovies) {
        if (err) {
          console.log("An error occurred" + err);
        } else {
          AllocineMovie.find({
            $and: [
              {
                genreListSimon: { $in: [parseInt(req.query.genre)] },
                media: { $ne: "nothing here" },
                statusList: { $in: ["nowshowing"] }
              }
            ]
          })
            .sort({ "statistics.theaterCount": "descending" })
            .sort({ "release.releaseDate": "ascending" })
            .exec(function(err, nowShowingMovies) {
              if (err) {
                console.log("An error occurred" + err);
              } else {
                res.json({
                  genre: req.query.genre,
                  total: comingSoonMovies.length + nowShowingMovies.length,
                  comingSoonCount: comingSoonMovies.length,
                  nowShowingCount: nowShowingMovies.length,
                  comingSoonMovies: comingSoonMovies,
                  nowShowingMovies: nowShowingMovies
                });
              }
            });
        }
      });
  }
});

// http://localhost:3002/api/movies/all-movies
router.get("/all-movies", function(req, res, next) {
  AllocineMovie.find({})
    .sort({ statusList: "descending" })
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

router.get("/swiperMoviesDeck/:userId", function(req, res, next) {
  User.findById(req.params.userId).exec(function(err, user) {
    if (err) {
      console.log("An error occurred" + err);
    } else {
      var query = user.account.favorites.concat(
        user.account.moviesSwiperLiked,
        user.account.moviesSwiperDisliked
      );
      AllocineMovie.find({})
        .where("_id")
        .nin(query)
        .where("statusList")
        .equals("nowshowing")
        .where("statistics.theaterCount")
        .gt(10)
        .sort({ "statistics.theaterCount": "descending" })
        .sort({ "release.releaseDate": "descending" })
        .limit(100)
        .exec(function(err, NowShowingMovies) {
          if (err) {
            console.log("An error occurred" + err);
          } else {
            AllocineMovie.find({})
              .where("_id")
              .nin(query)
              .where("statusList")
              .equals("comingsoon")
              // .where("statistics.theaterCount")
              // .gt(7)
              .sort({ "release.releaseDate": "ascending" })
              .sort({ "statistics.theaterCount": "descending" })
              .limit(100)
              .exec(function(err, ComingSoonMovies) {
                if (err) {
                  console.log("An error occurred" + err);
                } else {
                  var moviesDeck = NowShowingMovies.concat(ComingSoonMovies);
                  console.log(ComingSoonMovies.length);
                  res.json({
                    total: moviesDeck.length,
                    movies: moviesDeck
                  });
                }
              });
          }
        });
    }
  });
});

router.get("/showtimes", function(req, res, next) {
  allocine.api(
    "showtimelist",
    {
      movie: req.query.movie,
      count: !req.query.count ? 100 : req.query.count,
      lat: req.query.lat,
      long: req.query.long,
      radius: !req.query.radius ? 40 : req.query.radius,
      theaters: !req.query.theaters ? "" : req.query.theaters
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
        showtimes: results,
        radius: !req.query.radius ? 40 : req.query.radius
      });
    }
  );
});

module.exports = router;
