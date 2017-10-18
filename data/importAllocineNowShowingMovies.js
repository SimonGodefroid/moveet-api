// http://www.allocine.fr/film/fichefilm_gen_cfilm=228322.html
// http://api.allocine.fr/rest/v3/movie?partner=YW5kcm9pZC12Mg&code=124055&profile=large&format=json
require("dotenv").config();
var request = require("request");
var uid2 = require("uid2");
var mongoose = require("mongoose");
var _ = require("lodash");
var jsonfile = require("jsonfile");
var jsonfailedRequestsNowShowingMovies = "./save/tmp/failedRequestsNowShowingMovies.json";
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
//var moviesAllocineComingSoon = require("../save/tmp/moviesAllocineComingSoon.json");
var moviesAllocineNowShowing = require("../save/tmp/moviesAllocineNowShowing.json");
var movieInfo = [];
var failedRequestsNowShowingMovies = [];
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
  if (i === moviesAllocineNowShowing.length) {
    console.log("stop");
    setTimeout(
      function() {
        console.log("c'est fini");
        mongoose.connection.close();
        jsonfile.writeFile(
          jsonfailedRequestsNowShowingMovies,
          failedRequestsNowShowingMovies,
          function(err) {
            if (err !== null) {
              console.error(err);
            } else {
              console.log(
                "JSON saved with " +
                  failedRequestsNowShowingMovies.length +
                  " nowshowing errors on requests"
              );
            }
          }
        );
      },
      15000
    );
  }
  console.log("getInfo$movie.code", movie.code, movie.statusList);
  request(
    `http://api.allocine.fr/rest/v3/movie?partner=YW5kcm9pZC12Mg&code=${movie.code}&profile=large&format=json`,
    function(error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log("coucou request");
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
        var failedMovie = { movie };
        failedRequestsNowShowingMovies.push(failedMovie);
        console.log(
          "failedRequestsNowShowingMovies so far:",
          failedRequestsNowShowingMovies.length
        );
      }
    }
  );
}

var offset = 1000;
var i = 0;
moviesAllocineNowShowing.forEach(function(movie) {
  if (ids.indexOf(movie.code) === -1) {
    setTimeout(
      function() {
        i++;
        ids.push(movie.code);
        movie.release.releaseDate = new Date(movie.release.releaseDate);
        movie.statusList = "nowshowing";
        console.log(
          "Saving Now Showing Movie",
          i,
          "of",
          moviesAllocineNowShowing.length,
          "in",
          movie.statusList
        );
        getInfo(movie);
      },
      1000 + offset
    );
    offset += 1000;
  } else {
    console.log("doublon in Now Showing");
    offset += 1000;
  }
});
