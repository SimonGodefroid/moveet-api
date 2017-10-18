require("dotenv").config();

var uid2 = require("uid2");
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) {
    console.error("Could not connect to mongodb.");
  }
});

var User = require("../models/User.js");
var Movie = require("../models/Movie.js");

var users = require("./users.json");
var moviesUpcoming = require("./moviesUpcoming.json");
var moviesNowplaying = require("./moviesNowplaying.json");
var simonCat = [];

function addSimonCat(category) {
  console.log("category", category);
  console.log("typeof category", typeof category);
  switch (category) {
    case "28":
      simonCat = 1;
      break;
    case "12":
      simonCat = 1;
      break;
    case "16":
      simonCat = 3;
      break;
    case "35":
      simonCat = 4;
      break;
    case "80":
      simonCat = 5;
      break;
    case "99":
      simonCat = 9;
      break;
    case "18":
      simonCat = 2;
      break;
    case "10751":
      simonCat = 9;
      break;
    case "14":
      simonCat = 7;
      break;
    case "36":
      simonCat = 9;
      break;
    case "27":
      simonCat = 6;
      break;
    case "10402":
      simonCat = 9;
      break;
    case "9648":
      simonCat = 7;
      break;
    case "10749":
      simonCat = 8;
      break;
    case "878":
      simonCat = 7;
      break;
    case "10770":
      simonCat = 9;
      break;
    case "53":
      simonCat = 5;
      break;
    case "10752":
      simonCat = 9;
      break;
    case "37":
      simonCat = 9;
      break;
    default:
      simonCat = "";
  }
  console.log("result is ", simonCat);
  return simonCat;
}

let ids = [];
let genres_simon = [];
var genre_one_simon = [];
var genre_two_simon = [];
var genre_three_simon = [];
var genre_four_simon = [];

moviesUpcoming.forEach(function(upcoming_movie) {
  if (ids.indexOf(upcoming_movie.id) === -1) {
    ids.push(upcoming_movie.id);

    upcoming_movie.release_date = new Date(upcoming_movie.release_date);

    var data = new Movie({
      idProvider: upcoming_movie.id,
      providerName: "TMDB",
      type: "upcoming",
      title: upcoming_movie.title,
      overview: upcoming_movie.overview,
      poster_path: upcoming_movie.poster_path,
      adult: upcoming_movie.adult,
      release_date: upcoming_movie.release_date,
      genre_ids: upcoming_movie.genre_ids,
      genres_simon: [
        upcoming_movie.genre_ids[0]
          ? addSimonCat(upcoming_movie.genre_ids[0].toString())
          : null,
        upcoming_movie.genre_ids[1]
          ? addSimonCat(upcoming_movie.genre_ids[1].toString())
          : null,
        upcoming_movie.genre_ids[2]
          ? addSimonCat(upcoming_movie.genre_ids[2].toString())
          : null,
        upcoming_movie.genre_ids[3]
          ? addSimonCat(upcoming_movie.genre_ids[3].toString())
          : null
      ],
      id: upcoming_movie.id,
      original_title: upcoming_movie.original_title,
      original_language: upcoming_movie.original_language,
      backdrop_path: upcoming_movie.backdrop_path,
      popularity: upcoming_movie.popularity,
      vote_count: upcoming_movie.vote_count,
      video: upcoming_movie.video,
      vote_average: upcoming_movie.vote_average
    });
    var movie = new Movie(data);
    movie.save(function(err, obj) {
      if (err) {
        console.log("error saving movie");
      } else {
        //console.log("saved movie");
      }
    });
  } else {
    console.log("doublon");
  }
});

moviesNowplaying.forEach(function(nowplaying_movie) {
  if (ids.indexOf(nowplaying_movie.id) === -1) {
    ids.push(nowplaying_movie.id);

    nowplaying_movie.release_date = new Date(nowplaying_movie.release_date);

    var data = new Movie({
      idProvider: nowplaying_movie.id,
      providerName: "TMDB",
      type: "nowplaying",
      title: nowplaying_movie.title,
      overview: nowplaying_movie.overview,
      poster_path: nowplaying_movie.poster_path,
      adult: nowplaying_movie.adult,
      release_date: nowplaying_movie.release_date,
      genre_ids: nowplaying_movie.genre_ids,
      genres_simon: [
        nowplaying_movie.genre_ids[0]
          ? addSimonCat(nowplaying_movie.genre_ids[0].toString())
          : null,
        nowplaying_movie.genre_ids[1]
          ? addSimonCat(nowplaying_movie.genre_ids[1].toString())
          : null,
        nowplaying_movie.genre_ids[2]
          ? addSimonCat(nowplaying_movie.genre_ids[2].toString())
          : null,
        nowplaying_movie.genre_ids[3]
          ? addSimonCat(nowplaying_movie.genre_ids[3].toString())
          : null
      ],
      id: nowplaying_movie.id,
      original_title: nowplaying_movie.original_title,
      original_language: nowplaying_movie.original_language,
      backdrop_path: nowplaying_movie.backdrop_path,
      popularity: nowplaying_movie.popularity,
      vote_count: nowplaying_movie.vote_count,
      video: nowplaying_movie.video,
      vote_average: nowplaying_movie.vote_average
    });
    var movie = new Movie(data);
    movie.save(function(err, obj) {
      if (err) {
        console.log("error saving movie");
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
    console.log("saving users");
    users.forEach(function(user) {
      Movie.find(
        { idProvider: { $in: user.account.favorites } },
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
                  favorites: movies
                }
              }),
              "password01", // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
              function(err, obj) {
                if (err) {
                  console.error(err);
                } else {
                  console.log("saved user " + obj.account.username);
                }
              }
            );
          }
        }
      );
    });
  },
  5000
);

setTimeout(
  function() {
    mongoose.connection.close();
  },
  15000
);
