// CONTROLLERS
(() => {
	'use strict';
	const Movie = require('./movieModel');
	module.exports = acl => {
		return {
			// GET /search?q=tobi+ferret
			// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
			// ?sort[statistics.theaterCount]=1&sort[release.releaseDate]=1
			list: (req, res) => {
				let limit = '';
				let page = '';
				if (req.query.limit) {
					limit = parseInt(req.query.limit);
					console.log('page', limit);
				}
				if (req.query.page) {
					page = parseInt(req.query.page);
					console.log('page', page);
				}
				const skip = limit * page;
				console.log('skip', skip);
				// let sort = { $sort: { field1: 'sort order', field2: 'sort order' } };
				// let match = { $match: { $and: [{}] } };
				let q = [{ $skip: skip }, { $limit: limit }, { $match: {} }, { $sort: {} }];
				try {
					Movie.aggregate(q, (err, movies) => {
						if (err) {
							console.log('An error occurred' + err);
							return res.status(500).json({ success: false, message: err });
						} else {
							res.status(200).json({
								success: true,
								count: movies.length,
								message: movies
							});
						}
					});
				} catch (e) {
					return res.status(500).json({ success: false, message: 'error' });
				}
			},
			// create: (req, res) => {},
			read: (req, res) => {}
			// update: (req, res) => {},
			// delete: (req, res) => {}
		};
	};
})();
