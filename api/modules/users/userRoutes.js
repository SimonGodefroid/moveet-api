module.exports = app => {
	const Ctrl = require('./userController')();
	const User = require('./userModel.js');
	const Movie = require('../movies/movieModel.js');
	const _ = require('lodash');
	require('dotenv').config();
	const cloudinary = require('cloudinary');
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	// returns list of users
	app.route('/api/v1/users').get(Ctrl.list);
	// returns user by id
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})').get(Ctrl.read);
	// returns favorites for user with id
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/favorites').get(Ctrl.favoritesList);
};

router.get('/matches/:userId', (req, res) => {
	// on cherche l'utilisateur connecté
	User.findById(req.params.userId).exec((err, user) => {
		if (err) {
			console.log('An error occurred' + err);
			return res.status(500).json({ success: false, message: err });
		} else {
			// var queryParam = {};
			// queryParam["account.favorites"] = user.account.favorites;
			var query = user.account.favorites;
			User.find({})
				.where('account.favorites')
				.populate('account.favorites', 'originalTitle')
				.select('-token -email -__v')
				.in(query)
				.exec((err, matches) => {
					if (err) {
						console.log('An error occurred' + err);
					} else {
						// matches un tableau d'utilisateurs dont les favorites contiennent au moins un film en commun avec ceux du current user. Ce tableau contient aussi le current user, ainsi pour le sortir des résultats on fait un tableau temporaire qui s'appelle elementPos qui contient l'id de chaque user contenu dans matches. On fait donc un indexOf de l'id du current user pour trouver sa position dans le tableau matches...
						var elementPos = matches
							.map(function(x) {
								return x._id.toString();
							})
							.indexOf(req.params.userId);
						// ...puis on le sort du tableau en utilisant splice.
						matches.splice(elementPos, 1);
						// on créé un tableau vide dans lequel on pousse chaque user qui a matché avec le current user
						var usersMatching = [];
						for (var i = 0; i < matches.length; i++) {
							var matchUser = {};
							matchUser._id = matches[i]['_id'];
							matchUser.account = matches[i]['account'];
							//matchUser.username = matches[i]["account"]["username"];
							//matchUser.favorites = matches[i]["account"]["favorites"];
							var arr1 = matchUser.account.favorites.map(function(x) {
								return x._id.toString();
							});
							var arr2 = user.account.favorites.map(function(x) {
								return x.toString();
							});
							var matchingMoviesIds = _.intersection(arr1, arr2);
							matchUser.matchingMovies = matchingMoviesIds;
							matchUser.matchingMovies = matchingMoviesIds;
							usersMatching.push(matchUser);
						}
						//console.log("matches after loop arrays is equal to", arrays);
						res.json({
							currentUser: user.account.username,
							currentUserFavs: user.account.favorites,
							userMatches: usersMatching
						});
					}
				});
		}
	});
});

router.get('/buddyFinder/:movieId/for/:userId', function(req, res) {
	console.log('finding buddy for movieid', req.params.movieId, 'for user', req.params.userId);
	// on cherche l'utilisateur connecté
	var query = [req.params.movieId];
	User.find({})
		.where('account.favorites')
		.populate('account.favorites', 'originalTitle')
		.select('-token -email -__v')
		.in(query)
		.exec((err, matches) => {
			if (err) {
				console.log('An error occurred' + err);
			} else {
				console.log(matches.length);
				// matches un tableau d'utilisateurs dont les favorites contiennent au moins un film en commun avec ceux du current user. Ce tableau contient aussi le current user, ainsi pour le sortir des résultats on fait un tableau temporaire qui s'appelle elementPos qui contient l'id de chaque user contenu dans matches. On fait donc un indexOf de l'id du current user pour trouver sa position dans le tableau matches...
				var elementPos = matches
					.map(x => {
						return x._id.toString();
					})
					.indexOf(req.params.userId);
				// ...puis on le sort du tableau en utilisant splice.
				if (elementPos !== -1) {
					matches.splice(elementPos, 1);
				}
				// on créé un tableau vide dans lequel on pousse chaque user qui a matché avec le current user
				let buddiesFound = [];
				for (let i = 0; i < matches.length; i++) {
					let matchUser = {};
					matchUser._id = matches[i]['_id'];
					matchUser.account = matches[i]['account'];
					buddiesFound.push(matchUser);
				}
				return res.status(200).json({
					success: true,
					message: buddiesFound
				});
			}
		});
});

router.post('/:userId/saveUserImage/', function(req, res, next) {
	console.log('coucou saveuserimage');
	console.log('req.body.imagePath', req.body.imagePath);

	cloudinary.uploader.upload(req.body.imagePath, function(result) {
		console.log('result cloudinary', result);
		User.findOne(
			{
				_id: req.params.userId
			},
			function(err, user) {
				if (err) {
					console.log(err);
				} else {
					(user.account.picture = result.secure_url),
						user.save(function(err, obj) {
							console.log('user.account.picture', user.account.picture);
							console.log("on a sauvé l'image pour cet user");
							res.send('Image updated for user');
						});
				}
			}
		);
	});
});

router.post('/:userId/saveUserImageBase64/', function(req, res, next) {
	console.log(' body data', req.body.imageBase64.data.substr(0, 30));
	cloudinary.uploader.upload(
		req.body.imageBase64.data,
		// "data:image/gif;base64," + req.body.data,
		function(result) {
			console.log(Object.keys(result));
			User.findOne(
				{
					_id: req.params.userId
				},
				function(err, user) {
					if (err) {
						console.log(err);
					} else {
						user.account.picture = result.secure_url;
						user.account.cId = result.public_id;
						user.save(function(err, obj) {
							res.send('Image updated for user');
						});
					}
				}
			);
		}
	);
});

router.post('/:userId/moviesSwiperLike/:movieId', (req, res, next) => {
	User.findById(req.params.userId, (err, user) => {
		if (e) {
			console.log(e);
			return res.status(500).json({ success: false, message: e });
		} else {
			console.log(user);
			Movie.findById(req.params.movieId, (err, movie) => {
				if (e) {
					console.log(e);
					return res.status(500).json({ success: false, message: e });
				} else {
					if (user.account.moviesSwiperLiked.indexOf(movie._id) === -1) {
						user.account.moviesSwiperLiked.push(movie._id);
					} else {
						console.log('le film existe déjà dans les Liked');
					}
					user.save((err, obj) => {
						if (e) {
							return res.status(500).json({ success: false, message: e });
						} else {
							return res.status(200).json({ success: true, message: obj });
						}
					});
				}
			});
		}
	});
});

router.post('/:userId/moviesSwiperDislike/:movieId', function(req, res, next) {
	User.findById(req.params.userId, (err, user) => {
		if (e) {
			console.log(e);
			return res.status(500).json({ success: false, message: e });
		} else {
			console.log(user);
			Movie.findById(req.params.movieId, (err, movie) => {
				if (e) {
					console.log(e);
					return res.status(500).json({ success: false, message: e });
				} else {
					if (user.account.moviesSwiperDisliked.indexOf(movie._id) === -1) {
						user.account.moviesSwiperDisliked.push(movie._id);
					} else {
						console.log('le film existe déjà dans les Disliked');
					}
					user.save((e, obj) => {
						if (e) {
							return res.status(500).json({ success: false, message: e });
						}
						return res.status(200).json({ success: true, message: obj });
					});
				}
			});
		}
	});
});

router.post('/:userId/sendBuddyRequest/:buddyId', function(req, res, next) {
	// on cherche le user connecté, celui qui a fait la demande d'ajout
	User.findOne(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log("on a trouvé l'user", user.account.username);
				// maintenant on cherche le user qu'il a demandé en ami
				User.findOne(
					{
						_id: req.params.buddyId
					},
					function(err, buddy) {
						if (err) {
							console.log(err);
						} else {
							console.log(
								buddy.account.username,
								' a reçu une demande de la part de ',
								user.account.username
							);
							var buddyRequested = {};
							buddyRequested._id = buddy._id;
							user.account.buddiesRequestsSent.push(buddyRequested);
							var buddyRequesting = {};
							buddyRequesting._id = user._id;
							buddy.account.buddiesRequestsReceived.push(buddyRequesting);
							buddy.save(function(err, obj) {});
							user.save(function(err, obj) {
								res.send('OK la buddy request a été envoyée');
							});
						}
					}
				);
			}
		}
	);
});

// KIKIE DEMANDE A SIMON
//http://localhost:3002/api/user/58f12224fb71ce5b95d8eb3b/sendBuddyRequest/58f12224fb71ce5b95d8eb3a

router.post('/:userId/sendBuddyRequest/:buddyId', function(req, res, next) {
	// on cherche le user connecté, celui qui a fait la demande d'ajout
	User.findOne(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log("on a trouvé l'user", user.account.username);
				// maintenant on cherche le user qu'il a demandé en ami
				User.findOne(
					{
						_id: req.params.buddyId
					},
					function(err, buddy) {
						if (err) {
							console.log(err);
						} else {
							console.log(
								buddy.account.username,
								' a reçu une demande de la part de ',
								user.account.username
							);
							var buddyRequested = {};
							buddyRequested._id = buddy._id;
							user.account.buddiesRequestsSent.push(buddyRequested);
							var buddyRequesting = {};
							buddyRequesting._id = user._id;
							buddy.account.buddiesRequestsReceived.push(buddyRequesting);
							buddy.save(function(err, obj) {});
							user.save(function(err, obj) {
								res.send('OK la buddy request a été envoyée');
							});
						}
					}
				);
			}
		}
	);
});

// SIMON ACCEPTE KIKIE
//http://localhost:3002/api/user/58f12224fb71ce5b95d8eb3a/acceptBuddyRequest/58f12224fb71ce5b95d8eb3b

router.post('/:userId/acceptBuddyRequest/:buddyId', function(req, res, next) {
	// on cherche le user connecté, celui qui veut accepter la demande
	User.findOne(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log(user.account.username, ' va accepter la demande de ', req.params.buddyId);
				// on retire de la liste des buddiesRequestsReceived le user qui vient d'être accepté
				console.log('user.account.buddiesRequestsReceived', user.account.buddiesRequestsReceived);
				user.account.buddiesRequestsReceived.splice(
					user.account.buddiesRequestsReceived.indexOf(req.params.buddyId),
					1
				);
				// on ajoute à la liste des buddies, le buddy qui a fait la request et on lui donne le statut accepted, on ajoute la propriété addedBy avec l'id du requestor
				//
				User.findOne(
					{
						_id: req.params.buddyId
					},
					function(err, buddy) {
						// dans le compte du demandeur, on change le statut du demandé de requested à accepted.
						if (err) {
							console.log(err);
						} else {
							var elementPos = buddy.account.buddiesRequestsSent
								.map(function(x) {
									return x._id.toString();
								})
								.indexOf(req.params.userId);
							console.log('elementPos', elementPos);
							// on retire de la liste des demandes envoyées du buddy requestor, le buddy qui vient d'accepter la demande
							buddy.account.buddiesRequestsSent.splice(elementPos, 1);
							console.log('req.params.userId', req.params.userId);
							console.log('elementPos', elementPos);
							console.log('buddy.account.buddies', buddy.account.buddies);
							// on créé un objet du user qui a fait la demande
							var requestingBuddy = {};
							requestingBuddy._id = buddy._id;
							requestingBuddy.isBuddy = true;
							requestingBuddy.requestSentBy = buddy._id;
							requestingBuddy.addedAt = new Date();
							// on pousse le requesting buddy dans la liste des amis du user qui accepte
							user.account.buddies.push(requestingBuddy);

							// on créé un objet du user qui accepte la demande
							var acceptingBuddy = {};
							acceptingBuddy._id = user._id;
							acceptingBuddy.isBuddy = true;
							acceptingBuddy.requestAcceptedBy = user._id;
							acceptingBuddy.addedAt = new Date();
							// on pousse l'accepting buddy dans la liste des amis du user qui a fait la demande
							buddy.account.buddies.push(acceptingBuddy);
							buddy.save(function(err, obj) {});
							user.save(function(err, obj) {
								res.send('OK la buddy request a été acceptée');
							});
						}
					}
				);
			}
		}
	);
});

router.post('/:userId/cancelBuddyRequest/:buddyId', function(req, res, next) {
	// on cherche le user connecté, celui qui veut annuler sa demande
	User.findOne(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log(
					user.account.username, // simon
					' va annuler sa demande à ',
					req.params.buddyId // kikie
				);
				// on retire de la liste des buddiesRequestsSent le user pour lequel on a annulé la demande
				user.account.buddiesRequestsSent.splice(
					user.account.buddiesRequestsSent.indexOf(req.params.buddyId),
					1
				);
				// on retire dans la liste des requestReceived la request venant de la personne qui a annulé
				//
				User.findOne(
					{
						_id: req.params.buddyId
					},
					function(err, buddy) {
						// on trouve le buddy pour lequel le user annule sa demande d'amis
						if (err) {
							console.log(err);
						} else {
							var elementPos = buddy.account.buddiesRequestsReceived
								.map(function(x) {
									return x._id.toString();
								})
								.indexOf(req.params.userId);
							console.log('elementPos', elementPos);
							// on retire de la liste des demandes d'amis reçues, l'id du user qui vient d'annuler
							buddy.account.buddiesRequestsReceived.splice(elementPos, 1);
							console.log('req.params.userId', req.params.userId);
							console.log('elementPos', elementPos);
							console.log('buddy.account.buddies', buddy.account.buddies);
							buddy.save(function(err, obj) {});
							user.save(function(err, obj) {
								res.send('OK la buddy request a été annulée');
							});
						}
					}
				);
			}
		}
	);
});

router.post('/:userId/refuseBuddyRequest/:buddyId', function(req, res, next) {
	// on cherche le user connecté, celui qui veut refuser la demande
	User.findOne(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log(
					user.account.username, // kikie
					' va refuser la demande de ',
					req.params.buddyId // simon
				);
				// on retire de la liste des buddiesRequestsReceived le user qui vient d'être refusé
				console.log('user.account.buddiesRequestsReceived', user.account.buddiesRequestsReceived);
				user.account.buddiesRequestsReceived.splice(
					user.account.buddiesRequestsReceived.indexOf(req.params.buddyId),
					1
				);
				// on ajoute à la liste des buddies, le buddy qui a fait la request et on lui donne le statut accepted, on ajoute la propriété addedBy avec l'id du requestor
				//
				User.findOne(
					{
						_id: req.params.buddyId
					},
					function(err, buddy) {
						// dans le compte du demandeur, on change le statut du demandé de requested à accepted.
						if (err) {
							console.log(err);
						} else {
							var elementPos = buddy.account.buddiesRequestsSent
								.map(function(x) {
									return x._id.toString();
								})
								.indexOf(req.params.userId);
							console.log('elementPos', elementPos);
							// on retire de la liste des demandes envoyées du buddy requestor, le buddy qui vient d'accepter la demande
							buddy.account.buddiesRequestsSent.splice(elementPos, 1);
							console.log('req.params.userId', req.params.userId);
							console.log('elementPos', elementPos);
							console.log('buddy.account.buddies', buddy.account.buddies);
							buddy.save(function(err, obj) {});
							user.save(function(err, obj) {
								res.send('OK la buddy request a été refusée');
							});
						}
					}
				);
			}
		}
	);
});

router.post('/:userId/removeBuddy/:buddyId', function(req, res, next) {
	// on cherche le user connecté, celui qui retirer le buddy de ses amis
	User.findOne(
		{
			_id: req.params.userId
		},
		function(err, user) {
			if (err) {
				console.log(err);
			} else {
				console.log(
					user.account.username, // kikie
					' va retirer ',
					req.params.buddyId,
					' de ses buddies :(' // simon
				);
				// on retire de la liste des buddies le user qui vient d'être supprimé
				console.log('user.account.buddies', user.account.buddies);
				user.account.buddies.splice(user.account.buddies.indexOf(req.params.buddyId), 1);
				// on cherche le buddy qui vient d'être supprimé
				//
				User.findOne(
					{
						_id: req.params.buddyId
					},
					function(err, buddy) {
						// dans le compte du buddy supprimé on retire le suppresseur de la liste d'amis
						if (err) {
							console.log(err);
						} else {
							var elementPos = buddy.account.buddies
								.map(function(x) {
									return x._id.toString();
								})
								.indexOf(req.params.userId);
							console.log('elementPos', elementPos);
							// on retire de la liste des demandes envoyées du buddy requestor, le buddy qui vient d'accepter la demande
							buddy.account.buddies.splice(elementPos, 1);
							console.log('req.params.userId', req.params.userId);
							console.log('elementPos', elementPos);
							console.log('buddy.account.buddies', buddy.account.buddies);
							buddy.save(function(err, obj) {});
							user.save(function(err, obj) {
								res.send('OK le buddy a été supprimé :(');
							});
						}
					}
				);
			}
		}
	);
});
module.exports = router;
