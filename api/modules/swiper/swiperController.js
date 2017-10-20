// app.get('/swiperMoviesDeck/:userId', function(req, res, next) {
// 	User.findById(req.params.userId).exec(function(err, user) {
// 		if (err) {
// 			console.log('An error occurred' + err);
// 		} else {
// 			var query = user.account.favorites.concat(
// 				user.account.moviesSwiperLiked,
// 				user.account.moviesSwiperDisliked
// 			);
// 			AllocineMovie.find({})
// 				.where('_id')
// 				.nin(query)
// 				.where('statusList')
// 				.equals('nowshowing')
// 				.where('statistics.theaterCount')
// 				.gt(10)
// 				.sort({ 'statistics.theaterCount': 'descending' })
// 				.sort({ 'release.releaseDate': 'descending' })
// 				.limit(100)
// 				.exec(function(err, NowShowingMovies) {
// 					if (err) {
// 						console.log('An error occurred' + err);
// 					} else {
// 						AllocineMovie.find({})
// 							.where('_id')
// 							.nin(query)
// 							.where('statusList')
// 							.equals('comingsoon')
// 							// .where("statistics.theaterCount")
// 							// .gt(7)
// 							.sort({ 'release.releaseDate': 'ascending' })
// 							.sort({ 'statistics.theaterCount': 'descending' })
// 							.limit(100)
// 							.exec(function(err, ComingSoonMovies) {
// 								if (err) {
// 									console.log('An error occurred' + err);
// 								} else {
// 									var moviesDeck = NowShowingMovies.concat(ComingSoonMovies);
// 									console.log(ComingSoonMovies.length);
// 									res.json({
// 										total: moviesDeck.length,
// 										movies: moviesDeck
// 									});
// 								}
// 							});
// 					}
// 				});
// 		}
// 	});
// });
