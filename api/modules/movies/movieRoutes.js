module.exports = app => {
	const Ctrl = require('./movieController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	app.route('/api/movies').get(Ctrl.list);
	app.route('/api/movie/:id([a-fA-F\\d]{24})').get(Ctrl.read);
};

// app.get('/', function(req, res, next) {
// 	if (!req.query.genre) {
// 		return next('Genre is mandatory');
// 	} else if (!req.query.type) {
// 		AllocineMovie.find({
// 			$and: [
// 				{
// 					genreListSimon: { $in: [parseInt(req.query.genre)] },
// 					media: { $ne: 'nothing here' }
// 				}
// 			]
// 		})
// 			.sort({ 'statistics.theaterCount': 'descending' })
// 			.sort({ 'release.releaseDate': 'ascending' })
// 			.exec(function(err, movies) {
// 				if (err) {
// 					console.log('An error occurred' + err);
// 				} else {
// 					res.json({
// 						genre: req.query.genre,
// 						total: movies.length,
// 						movies: movies
// 					});
// 				}
// 			});
// 	} else {
// 		AllocineMovie.find({
// 			$and: [{ genreListSimon: { $in: [parseInt(req.query.genre)] } }, { statusList: { $in: [req.query.type] } }]
// 		})
// 			.sort({ 'statistics.theaterCount': 'descending' })
// 			.sort({ 'release.releasDate': 'ascending' })
// 			.sort({ statusList: 'descending' })
// 			.exec(function(err, movies) {
// 				if (err) {
// 					console.log('An error occurred' + err);
// 				} else {
// 					res.json({
// 						genre: req.query.genre,
// 						total: movies.length,
// 						movies: movies
// 					});
// 				}
// 			});
// 	}
// });

// 					genreListSimon: { $in: [parseInt(req.query.genre)] },
// 					media: { $ne: 'nothing here' },
// 					statusList: { $in: ['comingsoon'] }
// 			.sort({ 'statistics.theaterCount': 'descending' })
// 			.sort({ 'release.releaseDate': 'ascending' })
// 								genreListSimon: { $in: [parseInt(req.query.genre)] },
// 								media: { $ne: 'nothing here' },
// 								statusList: { $in: ['nowshowing'] }
// 						.sort({ 'statistics.theaterCount': 'descending' })
// 						.sort({ 'release.releaseDate': 'ascending' })
// 									genre: req.query.genre,
// 									total: comingSoonMovies.length + nowShowingMovies.length,
// 									comingSoonCount: comingSoonMovies.length,
// 									nowShowingCount: nowShowingMovies.length,
// 									comingSoonMovies: comingSoonMovies,

// 		.sort({ statusList: 'descending' })
// 		.sort({ 'release.releasDate': 'ascending' })
