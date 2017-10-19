require('dotenv').config();
const request = require('request');
const uid2 = require('uid2');
const mongoose = require('mongoose');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const jsonfailedRequestsComingSoonMovies = './save/tmp/failedRequestsComingSoonMovies.json';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, err => {
	//mongoose.connection.db.dropDatabase();
	if (err) {
		console.error('Could not connect to mongodb.');
	}
});

const Movie = require('../api/modules/movies/movieModel');

const moviesComingSoon = require('../save/tmp/moviesComingSoon.json');
let movieInfo = [];
let failedRequestsComingSoonMovies = [];
let ids = [];
let simonGenre = [];

const addSimonGenre = genre => {
	switch (genre) {
		case 'Documentaire':
			simonGenre = [9];
			break;
		case 'Biopic':
			simonGenre = [9];
			break;
		case 'Policier':
			simonGenre = [5];
			break;
		case 'Animation':
			simonGenre = [3];
			break;
		case 'Drame':
			simonGenre = [2];
			break;
		case 'Fantastique':
			simonGenre = [7];
			break;
		case 'Comédie':
			simonGenre = [4];
			break;
		case 'Action':
			simonGenre = [1];
			break;
		case 'Comédie dramatique':
			simonGenre = [4, 2];
			break;
		case 'Divers':
			simonGenre = [9];
			break;
		case 'Thriller':
			simonGenre = [5];
			break;
		case 'Epouvante-horreur':
			simonGenre = [6];
			break;
		case 'Science fiction':
			simonGenre = [7];
			break;
		case 'Famille':
			simonGenre = [4, 9];
			break;
		case 'Aventure':
			simonGenre = [1];
			break;
		case 'Opera':
			simonGenre = [9];
			break;
		case 'Dessin animé':
			simonGenre = [3];
			break;
		case 'Comédie musicale':
			simonGenre = [4];
			break;
		case 'Romance':
			simonGenre = [8];
			break;
		case 'Historique':
			simonGenre = [9];
			break;
		case 'Erotique':
			simonGenre = [9];
			break;
		case 'Guerre':
			simonGenre = [9];
			break;
		case 'Musical':
			simonGenre = [9];
			break;
		case 'Western':
			simonGenre = [9];
			break;
		case 'Science':
			simonGenre = [9];
			break;
		case 'Judiciaire':
			simonGenre = [5];
			break;
		case 'Espionnage':
			simonGenre = [5];
			break;
		default:
			simonGenre = '';
	}
	return simonGenre;
};

const stripHTML = text => {
	let textRes = !text ? '' : text;
	let regex = /(<([^>]+)>)/gi;
	return textRes.replace(regex, '');
};

const getInfo = movie => {
	if (i === moviesComingSoon.length) {
		console.log('stop');
		setTimeout(() => {
			console.log("c'est fini");
			mongoose.connection.close();
			jsonfile.writeFile(jsonfailedRequestsComingSoonMovies, failedRequestsComingSoonMovies, err => {
				if (err !== null) {
					console.error(err);
				} else {
					console.log(
						'JSON saved with ' + failedRequestsComingSoonMovies.length + ' nowshowing errors on requests'
					);
				}
			});
		}, 15000);
	}
	console.log('getInfo$movie.code', movie.code, movie.statusList);
	request(
		`http://api.allocine.fr/rest/v3/movie?partner=YW5kcm9pZC12Mg&code=${movie.code}&profile=large&format=json`,
		(error, response, body) => {
			if (!error && response.statusCode == 200) {
				const result = JSON.parse(body);
				let movieInfo = [];
				let movieSynopsis = '';
				if (!result.movie.media) {
					movieInfo.push(['nothing here']);
				} else {
					movieInfo.push(result.movie.media[0].type.$);
					movieInfo.push(result.movie.media[0].thumbnail.href);
					movieInfo.push(
						result.movie.media[0].title.substring(0, result.movie.media[0].title.search(' : Affiche'))
					);
				}
				movieSynopsis = stripHTML(result.movie.synopsis);
				let genreList = [];
				result.movie.genre.map(genre => genreList.push(genre.$));
				let genreListSimon = [];
				genreList.map(genreAllocine => genreListSimon.push(addSimonGenre(genreAllocine)));
				let genreListSimonArr = [].concat.apply([], genreListSimon);
				let genreListSimonToSave = _.uniq(genreListSimonArr).sort();
				let data = new Movie({
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
							value: !movie.language ? 'language' : movie.language.$
						}
					],
					castingShort: movie.castingShort,
					trailer: movie.trailer,
					trailerEmbed: movie.trailerEmbed,
					hasShowtime: movie.hasShowtime,
					hasPreview: movie.hasPreview,
					statistics: movie.statistics
				});
				let comingMovie = new Movie(data);
				comingMovie.save((err, obj) => {
					if (err) {
						console.log('error saving movie', err);
					} else {
					}
				});
			} else {
				console.log('erreur', error);
				console.log('erreur dans la requête sur film avec id', movie.code, movie.statusList);
				failedRequestsComingSoonMovies.push({
					movie
				});
			}
		}
	);
};

let offset = 1000;
let i = 0;
moviesComingSoon.forEach(movie => {
	if (ids.indexOf(movie.code) === -1) {
		setTimeout(() => {
			i++;
			ids.push(movie.code);
			movie.release.releaseDate = new Date(movie.release.releaseDate);
			movie.statusList = 'comingsoon';
			console.log('Saving Coming Soon Movie', i, 'of', moviesComingSoon.length, 'in', movie.statusList);
			getInfo(movie);
		}, 1000 + offset);
		offset += 1000;
	} else {
		console.log('doublon in Coming Soon');
		offset += 1000;
	}
});
