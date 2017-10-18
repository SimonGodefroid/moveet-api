var mongoose = require("mongoose");

var AllocineMovieSchema = new mongoose.Schema({
  code: Number,
  movieType: {
    code: Number,
    value: String
  },
  originalTitle: String,
  title: String,
  productionYear: Number,
  synopsis: String,
  nationality: Array,
  genreList: Array,
  genreListSimon: [Number],
  media: String,
  posterPath: String,
  statusList: String,
  release: {
    releaseDate: Object,
    country: {
      code: Number,
      value: String
    },
    releaseState: {
      code: Number,
      value: String
    },
    distributor: {
      code: Number,
      name: String
    }
  },
  runtime: Number,
  color: {
    value: String
  },
  language: [
    {
      value: String
    }
  ],
  castingShort: {
    directors: String
  },
  trailer: {
    href: String
  },
  trailerEmbed: String,
  hasShowtime: Number,
  hasPreview: Number,
  statistics: Object
});

module.exports = mongoose.model(
  "AllocineMovie",
  AllocineMovieSchema,
  "allocinemovies"
);
