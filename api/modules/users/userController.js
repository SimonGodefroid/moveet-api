(() => {
	'use strict';
	const User = require('./userModel'),
		Movie = require('../movies/movieModel.js'),
		Global = require('../../../Global');
	module.exports = acl => {
		return {
			list: (req, res) => {
				User.find({})
					.exec()
					.then((e, users) => {
						return res.status(200).json({
							success: true,
							message: users
						});
					})
					.catch(e => {
						return res.status(400).json({ success: false, message: e });
					});
			},
			create: (req, res) => {},
			read: (req, res) => {},
			update: (req, res) => {
				User.findOneAndUpdate(
					{
						_id: req.params.userId
					},
					req.body,
					{ new: true },
					(err, user) => {
						if (err) {
							console.log(err);
							return res.status(500).json({ success: false, message: err });
						} else {
							return res.status(200).json({ success: true, message: user });
						}
					}
				);
			},
			delete: (req, res) => {},
			favoritesList: (req, res) => {
				// implement aggregate
				User.findById(req.params.userId)
					.populate('account.favorites')
					.exec()
					.then(user => {
						if (!user) {
							return res.status(404).json({ success: false, message: 'user not found' });
						}
						return res.json({ success: true, message: user.account.favorites });
					})
					.catch(e => {
						return res.status(400).json({ success: false, message: e });
					});
			},
			favoritesToggle: (req, res) => {
				User.findById(req.params.userId, (e, user) => {
					if (e) {
						console.log(e);
						return res.status(500).json({ success: false, message: e });
					} else {
						Movie.findById(req.params.movieId, (e, movie) => {
							if (e) {
								console.log(e);
								return res.status(500).json({ success: false, message: e });
							} else {
								if (user.account.favorites.indexOf(movie._id) === -1) {
									user.account.favorites.push(movie._id);
								} else {
									user.account.favorites.splice(user.account.favorites.indexOf(movie._id), 1);
								}
								user.save((e, user) => {
									if (e) {
										return res.status(500).json({ success: false, message: e });
									}
									return res.status(200).json({ success: true, message: user });
								});
							}
						});
					}
				});
			}
		};
	};
})();
