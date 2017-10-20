// CONTROLLERS
(() => {
	'use strict';
	const Movie = require('./movieModel'),
		mongoose = require('mongoose');
	module.exports = acl => {
		return {
			// GET /search?q=tobi+ferret
			// GET /shoes?order=desc&shoe[color]=blue&shoe[type]=converse
			// ?sort[statistics.theaterCount]=1&sort[release.releaseDate]=1
			list: (req, res) => {
				let query = {};
				!req.query.page || isNaN(req.query.page) ? (query.skip = 1) : (query.skip = parseInt(req.query.page));
				!req.query.limit || isNaN(req.query.limit)
					? (query.limit = 100)
					: (query.limit = parseInt(req.query.limit));
				if (!req.query.sort || req.query.sort === '') {
					query.sort = {};
				} else {
					query.sort = {};
					query['sort'][Object.keys(req['query']['sort'])[0]] = parseInt(
						req['query']['sort'][Object.keys(req.query.sort)[0]]
					);
				}
				console.log('req.params', query.sort);
				// const keys = Object.keys(Interim.schema.paths);
				// const q = Global.queryBuilder(keys, req);
				Movie.aggregate(
					[
						// {
						// 	$match: q
						// },
						{
							$skip: (query.skip - 1) * query.limit
						},
						{
							$limit: query.limit
						},
						{
							$sort: query.sort
						}
					],
					(err, movies) => {
						if (err) {
							console.log('An error occurred' + err);
							return res.status(500).json({ success: false, message: err });
						} else {
							res.status(200).json({
								success: true,
								count: movies.length,
								limit: query.limit,
								message: movies
							});
						}
					}
				);
			},
			read: (req, res) => {
				Movie.aggregate(
					[
						{
							$match: { _id: mongoose.Types.ObjectId(req.params.id) }
						}
					],
					(err, object) => {
						if (err) {
							console.log('An error occurred' + err);
							return res.status(500).json({ success: false, message: err });
						} else {
							res.status(200).json({
								success: true,
								message: object
							});
						}
					}
				);
			}
		};
	};
})();
