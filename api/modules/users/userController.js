(() => {
	'use strict';
	const User = require('./userModel'),
		Movie = require('../movies/movieModel.js'),
		mongoose = require('mongoose');
	// Global = require('../../../Global');
	module.exports = acl => {
		return {
			list: (req, res) => {
				User.find({})
					.exec()
					.then(users => {
						return res.status(200).json({
							success: true,
							count: users.length,
							message: users
						});
					})
					.catch(err => {
						console.log('err', err);
						return res.status(500).json({ success: false, message: err });
					});
			},
			create: (req, res) => {},
			read: (req, res) => {
				User.aggregate([{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }])
					.exec()
					.then(user => {
						let result = user;
						if (user.length > 0) {
							result = user[0];
						}
						return res.status(200).json({
							success: true,
							message: result
						});
					})
					.catch(err => {
						console.log('err', err);
						return res.status(500).json({ success: false, message: err });
					});
			},
			update: (req, res) => {
				User.findOneAndUpdate(
					{
						_id: req.params.id
					},
					req.body,
					{ new: true }
				)
					.exec()
					.then(user => {
						return res.status(200).json({ success: true, message: user });
					})
					.catch(err => {
						console.log('err', err);
						return res.status(500).json({ success: false, message: err });
					});
			},
			delete: (req, res) => {},
			favoritesList: (req, res) => {
				User.aggregate([
					{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
					{
						$unwind: { path: '$account.favorites' }
					},
					{
						$lookup: {
							from: 'movies',
							localField: 'account.favorites',
							foreignField: '_id',
							as: 'favorites'
						}
					},
					{
						$unwind: {
							path: '$favorites'
						}
					},
					{
						$group: {
							_id: '$_id',
							favoriteIds: { $push: '$account.favorites' },
							favorites: { $push: '$favorites' }
						}
					}
				]).exec((err, user) => {
					let result = user;
					if (user.length > 0) {
						result = user[0];
					}
					if (err) {
						console.log('err', err);
						return res.status(500).json({ success: false, message: err });
					} else {
						return res.json({ success: true, message: result });
					}
				});
			},
			favoritesToggle: (req, res) => {
				Movie.findById(req.params.movieid, (err, movie) => {
					if (err || movie === null) {
						console.log(err);
						return res.status(500).json({ success: false, message: err || 'movie not found' });
					} else {
						User.findById(req.params.id, (err, user) => {
							if (err) {
								console.log(err);
								return res.status(500).json({ success: false, message: err });
							} else {
								let queryObj = { _id: mongoose.Types.ObjectId(req.params.id) };
								let updateOperator = {};
								let queryOperator = '$push';
								let favorite = { 'account.favorites': req.params.movieid };
								let options = { new: true };
								if (user.account.favorites.indexOf(req.params.movieid) !== -1) {
									queryOperator = '$pull';
									updateOperator[queryOperator] = favorite;
								} else {
									updateOperator[queryOperator] = favorite;
								}
								User.findOneAndUpdate(queryObj, updateOperator, options, (err, user) => {
									if (err) {
										console.log('err', err);
										return res.status(500).json({ success: false, message: err });
									}
									return res.status(200).json({ success: true, message: user });
								});
							}
						});
					}
				});
			},
			matchesList: (req, res) => {
				User.findById(req.params.id).exec((err, user) => {
					if (err) {
						console.log('An error occurred' + err);
						return res.status(500).json({ success: false, message: err });
					} else {
						let query = user.account.favorites;
						User.aggregate(
							[
								{
									$match: {
										_id: { $ne: mongoose.Types.ObjectId(req.params.id) },
										'account.favorites': {
											$in: query
										}
									}
								},
								{
									$project: {
										account: 1,
										favorites: '$account.favorites'
									}
								},
								{
									$project: {
										account: 1,
										matchesCount: {
											$size: {
												$setIntersection: [query, '$favorites']
											}
										},
										matchesIds: {
											$setIntersection: [query, '$favorites']
										}
									}
								},
								{
									$lookup: {
										from: 'movies',
										localField: 'matchesIds',
										foreignField: '_id',
										as: 'matchingMovies'
									}
								},
								{
									$project: {
										account: 1,
										matchesCount: 1,
										matchesIds: 1,
										matchingMovies: 1
									}
								}
							],
							(err, matches) => {
								if (err) {
									console.log('err', err);
									return res.status(500).json({ success: false, message: err });
								} else {
									return res.status(200).json({ success: true, message: matches });
								}
							}
						);
					}
				});
			},
			buddyFinder: (req, res) => {
				let query = [mongoose.Types.ObjectId(req.params.movieid)];
				User.aggregate(
					[
						{
							$match: {
								_id: { $ne: mongoose.Types.ObjectId(req.params.id) },
								'account.favorites': {
									$in: query
								}
							}
						},
						{
							$project: {
								account: 1,
								threeFav: { $slice: ['$account.favorites', 3] }
							}
						},
						{
							$lookup: {
								from: 'movies',
								localField: 'threeFav',
								foreignField: '_id',
								as: 'threeFavorites'
							}
						},
						{
							$project: {
								'account.subscription': 1,
								'account.age': 1,
								'account.genre': 1,
								'account.description': 1,
								'account.picture': 1,
								'account.location': 1,
								'account.username': 1,
								threeFavorites: 1
							}
						}
					],
					(err, buddies) => {
						if (err) {
							console.log('err', err);
							return res.status(500).json({ success: false, message: err });
						} else {
							return res.status(200).json({ success: true, count: buddies.length, message: buddies });
						}
					}
				);
			},
			swipeLike: (req, res) => {
				User.findById(req.params.id, (err, user) => {
					if (err) {
						console.log(err);
						return res.status(500).json({ success: false, message: err });
					} else {
						console.log(user);
						Movie.findById(req.params.movieid, (err, movie) => {
							if (err) {
								console.log(err);
								return res.status(500).json({ success: false, message: err });
							} else {
								if (user.swipeLike.indexOf(movie._id) === -1) {
									user.swipeLike.push(movie._id);
								} else {
									console.log('le film existe déjà dans les Liked');
								}
								user.save((err, obj) => {
									if (err) {
										return res.status(500).json({ success: false, message: err });
									} else {
										return res.status(200).json({ success: true, message: obj });
									}
								});
							}
						});
					}
				});
			},
			swipePass: (req, res) => {
				User.findById(req.params.id, (err, user) => {
					if (err) {
						console.log(err);
						return res.status(500).json({ success: false, message: err });
					} else {
						console.log(user);
						Movie.findById(req.params.movieid, (err, movie) => {
							if (err) {
								console.log(err);
								return res.status(500).json({ success: false, message: err });
							} else {
								if (user.swipePass.indexOf(movie._id) === -1) {
									user.swipePass.push(movie._id);
								} else {
									console.log('le film existe déjà dans les Disliked');
								}
								user.save((err, obj) => {
									if (err) {
										return res.status(500).json({ success: false, message: err });
									}
									return res.status(200).json({ success: true, message: obj });
								});
							}
						});
					}
				});
			}
		};
	};
})();
