require("dotenv").config();
var request = require("request");
var uid2 = require("uid2");
var mongoose = require("mongoose");
var _ = require("lodash");
var jsonfile = require("jsonfile");
var jsonFailedRequests = "./save/tmp/failedRequests.json";
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  mongoose.connection.db.dropDatabase();
  if (err) {
    console.error("Could not connect to mongodb.");
  }
});

var User = require("../models/User.js");
var AllocineMovie = require("../models/AllocineMovie.js");

var users = require("./users.json");
var moviesAllocineComingSoon = require("../save/tmp/moviesAllocineComingSoon.json");
var moviesAllocineNowShowing = require("../save/tmp/moviesAllocineNowShowing.json");
var movieInfo = [];
var failedRequests = [];
let ids = [];
var simonGenre = [];

function addSimonGenre(genre) {
  //console.log("genre", genre);
  // console.log("typeof category", typeof category);
  switch (genre) {
    case "Documentaire":
      simonGenre = [9];
      break;
    case "Biopic":
      simonGenre = [9];
      break;
    case "Policier":
      simonGenre = [5];
      break;
    case "Animation":
      simonGenre = [3];
      break;
    case "Drame":
      simonGenre = [2];
      break;
    case "Fantastique":
      simonGenre = [7];
      break;
    case "Comédie":
      simonGenre = [4];
      break;
    case "Action":
      simonGenre = [1];
      break;
    case "Comédie dramatique":
      simonGenre = [4, 2];
      break;
    case "Divers":
      simonGenre = [9];
      break;
    case "Thriller":
      simonGenre = [5];
      break;
    case "Epouvante-horreur":
      simonGenre = [6];
      break;
    case "Science fiction":
      simonGenre = [7];
      break;
    case "Famille":
      simonGenre = [4, 9];
      break;
    case "Aventure":
      simonGenre = [1];
      break;
    case "Opera":
      simonGenre = [9];
      break;
    case "Dessin animé":
      simonGenre = [3];
      break;
    case "Comédie musicale":
      simonGenre = [4];
      break;
    case "Romance":
      simonGenre = [8];
      break;
    case "Historique":
      simonGenre = [9];
      break;
    case "Erotique":
      simonGenre = [9];
      break;
    case "Guerre":
      simonGenre = [9];
      break;
    case "Musical":
      simonGenre = [9];
      break;
    case "Western":
      simonGenre = [9];
      break;
    case "Science":
      simonGenre = [9];
      break;
    case "Judiciaire":
      simonGenre = [5];
      break;
    case "Espionnage":
      simonGenre = [5];
      break;
    default:
      simonGenre = "";
  }
  //console.log("result is ", simonGenre);
  return simonGenre;
}

function stripHTML(text) {
  var text = !text ? "" : text;
  var regex = /(<([^>]+)>)/ig;
  return text.replace(regex, "");
}

function getInfo(movie) {
  console.log("getInfo$movie.code", movie.code, movie.statusList);
  request(
    `http://api.allocine.fr/rest/v3/movie?partner=YW5kcm9pZC12Mg&code=${movie.code}&profile=large&format=json`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        var movieInfo = [];
        var movieSynopsis = "";
        if (!result.movie.media) {
          movieInfo.push(["nothing here"]);
        } else {
          movieInfo.push(result.movie.media[0].type.$);
          movieInfo.push(result.movie.media[0].thumbnail.href);
          movieInfo.push(
            result.movie.media[0].title.substring(
              0,
              result.movie.media[0].title.search(" : Affiche")
            )
          );
        }
        movieSynopsis = stripHTML(result.movie.synopsis);
        let genreList = [];
        result.movie.genre.map(genre => genreList.push(genre.$));
        let genreListSimon = [];
        genreList.map(genreAllocine =>
          genreListSimon.push(addSimonGenre(genreAllocine)));
        var genreListSimonArr = [].concat.apply([], genreListSimon);
        var genreListSimonToSave = _.uniq(genreListSimonArr).sort();
        var data = new AllocineMovie({
          code: movie.code,
          movieType: {
            code: movie.movieType.code,
            value: movie.movieType.$
          },
          originalTitle: movieInfo[2],
          title: movie.title,
          synopsis: movieSynopsis,
          media: movieInfo[0],
          posterPath: movieInfo[1],
          productionYear: movie.productionYear,
          genreList: genreList,
          genreListSimon: genreListSimonToSave,
          statusList: movie.statusList,
          release: {
            releaseDate: movie.release.releaseDate,
            country: movie.release.country,
            releaseState: {
              code: movie.release.releaseState.code,
              value: movie.release.releaseState.$
            },
            distributor: movie.distributor
          },
          runtime: movie.runtime,
          language: [
            {
              value: !movie.language ? "language" : movie.language.$
            }
          ],
          castingShort: movie.castingShort,
          trailer: movie.trailer,
          trailerEmbed: movie.trailerEmbed,
          hasShowtime: movie.hasShowtime,
          hasPreview: movie.hasPreview,
          statistics: movie.statistics
        });
        var allocinemovie = new AllocineMovie(data);
        allocinemovie.save(function(err, obj) {
          if (err) {
            console.log("error saving movie", err);
          } else {
          }
        });
      } else {
        console.log("erreur", error);
        console.log(
          "erreur dans la requête sur film avec id",
          movie.code,
          movie.statusList
        );
        failedRequests.push({
          code: movie.code,
          statusList: movie.statusList,
          errorMessage: error
        });
      }
    }
  );
}

var offset = 0;
var i = 1;
moviesAllocineComingSoon.forEach(function(movie) {
  if (ids.indexOf(movie.code) === -1) {
    setTimeout(
      function() {
        ids.push(movie.code);
        movie.release.releaseDate = new Date(movie.release.releaseDate);
        movie.statusList = "comingsoon";
        console.log(
          "Saving Coming Soon Movie",
          i,
          "of",
          moviesAllocineComingSoon.length,
          "in",
          movie.statusList
        );
        getInfo(movie);

        i++;
      },
      1000 + offset
    );
    offset += 1000;
  } else {
    console.log("doublon in Coming Soon");
    offset += 5000;
  }
  if (i === moviesAllocineComingSoon.length - 1) {
    mongoose.connection.close();
    console.log("closing mongoose connection");
    console.log("i à la fin", i);
    jsonfile.writeFile(jsonFailedRequests, failedRequests, function(err) {
      if (err !== null) {
        console.error("erreu jsonfile", err);
      } else {
        console.log(
          "JSON saved with " +
            failedRequests.length +
            "failedRequests in comingsoon"
        );
      }
    });
  }
});

// moviesAllocineNowShowing.forEach(function(movie) {
//   if (ids.indexOf(movie.code) === -1) {
//     ids.push(movie.code);
//     movie.release.releaseDate = new Date(movie.release.releaseDate);
//     movie.statusList = "nowshowing";
//     console.log("Saving Now Showing Movie");
//     getInfo(movie);
//   } else {
//     console.log("doublon in Now Showing");
//   }
// });

setTimeout(
  function() {
    console.log("saving users");
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
                  favorites: movies
                }
              }),
              "password01", // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
              function(err, obj) {
                if (err) {
                  console.error(err);
                  console.log("erreur dans le save");
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

// setTimeout(
//   function() {
//     mongoose.connection.close();
//     console.log("closing mongoose connection");
//   },
//   250000
// );
