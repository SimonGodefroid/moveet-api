// CONTROLLERS
(() => {
	'use strict';
	const Movie = require('./movieModel'),
		keys = Object.keys(Movie.schema.paths),
		mongoose = require('mongoose'),
		_ = require('lodash');
	module.exports = acl => {
		return {
			list: (req, res) => {
				let query = [];
				let skip = '';
				let limit = '';
				let sort = {};
				let match = {};
				let q = {};
				let matchKeys = req.query ? _.without(Object.keys(req.query), 'limit', 'page', 'sort') : [];
				if (matchKeys.length > 0) {
					q.$and = [];
					for (let i in matchKeys) {
						match = {};
						match[matchKeys[i]] = {};
						match[matchKeys[i]]['$in'] = [];
						let values = req['query'][matchKeys[i]].split(',');
						values.map(val => {
							return match[matchKeys[i]]['$in'].push(parseInt(val) || val);
						});
						q.$and.push(match);
					}
				}
				!req.query.page || isNaN(req.query.page) ? (skip = 1) : (skip = parseInt(req.query.page));
				!req.query.limit || isNaN(req.query.limit) ? (limit = 100) : (limit = parseInt(req.query.limit));
				if (req.query.sort && (req.query.sort !== '' || Object.keys(req.query.sort).length > 0)) {
					for (let i in Object.keys(req.query.sort)) {
						sort[Object.keys(req.query.sort)[i]] = parseInt(Object.values(req.query.sort)[i]);
					}
					query.push({ $sort: sort });
				}
				query.push({ $match: q });
				query.push({ $skip: (skip - 1) * limit });
				query.push({ $limit: limit });
				console.log(JSON.stringify(query, null, 4));
				Movie.aggregate([{ $match: q }], (err, count) => {
					Movie.count({}, (err, total) => {
						Movie.aggregate(query, (err, movies) => {
							if (err) {
								console.log('An error occurred' + err);
								return res.status(500).json({ success: false, message: err });
							} else {
								res.status(200).json({
									success: true,
									limit: limit,
									total: total,
									results: count.length,
									count: movies.length,
									message: movies
								});
							}
						});
					});
				});
			},
			read: (req, res) => {
				let query = [{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }];
				Movie.aggregate(query, (err, object) => {
					if (err) {
						console.log('An error occurred' + err);
						return res.status(500).json({ success: false, message: err });
					} else {
						if (object.length > 0) {
							result = object[0];
						}
						res.status(200).json({
							success: true,
							message: result
						});
					}
				});
			}
		};
	};
})();
