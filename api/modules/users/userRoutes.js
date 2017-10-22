module.exports = app => {
	const Ctrl = require('./userController')();
	const User = require('./userModel');
	const Movie = require('../movies/movieModel');
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
	// returns the users for which favorites matches the user's favorites
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/matches').get(Ctrl.matchesList);
	// returns a list of buddies that want to see the same movie as the given user
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/findbuddy/:movieid([a-fA-F\\d]{24})').get(Ctrl.buddyFinder);
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/favorites/:movieid([a-fA-F\\d]{24})').post(Ctrl.favoritesToggle);
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/swipelike/:movieid([a-fA-F\\d]{24})').post(Ctrl.swipeLike);
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/swipepass/:movieid([a-fA-F\\d]{24})').post(Ctrl.swipePass);
};

// router.post('/:userId/saveUserImage/', function(req, res, next) {
// 	cloudinary.uploader.upload(req.body.imagePath, function(result) {
// 		User.findOne(
// 			{
// 				_id: req.params.userId
// 			},
// 			(err, user) =>{
// 				if (err) {
// 					console.log(err);
// 				} else {
// 					user.account.picture = result.secure_url;
// 						user.save((err, obj)=> {
// 							res.send('Image updated for user');
// 						});
// 				}
// 			}
// 		);
// 	});
// });

// router.post('/:userId/saveUserImageBase64/', function(req, res, next) {
// 	console.log(' body data', req.body.imageBase64.data.substr(0, 30));
// 	cloudinary.uploader.upload(
// 		req.body.imageBase64.data,
// 		// "data:image/gif;base64," + req.body.data,
// 		(result) =>{
// 			console.log(Object.keys(result));
// 			User.findOne(
// 				{
// 					_id: req.params.userId
// 				},
// 				(err, user) =>{
// 					if (err) {
// 						console.log(err);
// 					} else {
// 						user.account.picture = result.secure_url;
// 						user.account.cId = result.public_id;
// 						user.save((err, obj) =>{
// 							res.send('Image updated for user');
// 						});
// 					}
// 				}
// 			);
// 		}
// 	);
// });

// router.post('/:userId/sendBuddyRequest/:buddyId', function(req, res, next) {
// 	// on cherche le user connecté, celui qui a fait la demande d'ajout
// 	User.findOne(
// 		{
// 			_id: req.params.userId
// 		},
// 		function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("on a trouvé l'user", user.account.username);
// 				// maintenant on cherche le user qu'il a demandé en ami
// 				User.findOne(
// 					{
// 						_id: req.params.buddyId
// 					},
// 					function(err, buddy) {
// 						if (err) {
// 							console.log(err);
// 						} else {
// 							console.log(
// 								buddy.account.username,
// 								' a reçu une demande de la part de ',
// 								user.account.username
// 							);
// 							var buddyRequested = {};
// 							buddyRequested._id = buddy._id;
// 							user.account.buddiesRequestsSent.push(buddyRequested);
// 							var buddyRequesting = {};
// 							buddyRequesting._id = user._id;
// 							buddy.account.buddiesRequestsReceived.push(buddyRequesting);
// 							buddy.save(function(err, obj) {});
// 							user.save(function(err, obj) {
// 								res.send('OK la buddy request a été envoyée');
// 							});
// 						}
// 					}
// 				);
// 			}
// 		}
// 	);
// });

// // KIKIE DEMANDE A SIMON
// //http://localhost:3002/api/user/58f12224fb71ce5b95d8eb3b/sendBuddyRequest/58f12224fb71ce5b95d8eb3a

// router.post('/:userId/sendBuddyRequest/:buddyId', function(req, res, next) {
// 	// on cherche le user connecté, celui qui a fait la demande d'ajout
// 	User.findOne(
// 		{
// 			_id: req.params.userId
// 		},
// 		function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log("on a trouvé l'user", user.account.username);
// 				// maintenant on cherche le user qu'il a demandé en ami
// 				User.findOne(
// 					{
// 						_id: req.params.buddyId
// 					},
// 					function(err, buddy) {
// 						if (err) {
// 							console.log(err);
// 						} else {
// 							console.log(
// 								buddy.account.username,
// 								' a reçu une demande de la part de ',
// 								user.account.username
// 							);
// 							var buddyRequested = {};
// 							buddyRequested._id = buddy._id;
// 							user.account.buddiesRequestsSent.push(buddyRequested);
// 							var buddyRequesting = {};
// 							buddyRequesting._id = user._id;
// 							buddy.account.buddiesRequestsReceived.push(buddyRequesting);
// 							buddy.save(function(err, obj) {});
// 							user.save(function(err, obj) {
// 								res.send('OK la buddy request a été envoyée');
// 							});
// 						}
// 					}
// 				);
// 			}
// 		}
// 	);
// });

// // SIMON ACCEPTE KIKIE
// //http://localhost:3002/api/user/58f12224fb71ce5b95d8eb3a/acceptBuddyRequest/58f12224fb71ce5b95d8eb3b

// router.post('/:userId/acceptBuddyRequest/:buddyId', function(req, res, next) {
// 	// on cherche le user connecté, celui qui veut accepter la demande
// 	User.findOne(
// 		{
// 			_id: req.params.userId
// 		},
// 		function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log(user.account.username, ' va accepter la demande de ', req.params.buddyId);
// 				// on retire de la liste des buddiesRequestsReceived le user qui vient d'être accepté
// 				console.log('user.account.buddiesRequestsReceived', user.account.buddiesRequestsReceived);
// 				user.account.buddiesRequestsReceived.splice(
// 					user.account.buddiesRequestsReceived.indexOf(req.params.buddyId),
// 					1
// 				);
// 				// on ajoute à la liste des buddies, le buddy qui a fait la request et on lui donne le statut accepted, on ajoute la propriété addedBy avec l'id du requestor
// 				//
// 				User.findOne(
// 					{
// 						_id: req.params.buddyId
// 					},
// 					function(err, buddy) {
// 						// dans le compte du demandeur, on change le statut du demandé de requested à accepted.
// 						if (err) {
// 							console.log(err);
// 						} else {
// 							var elementPos = buddy.account.buddiesRequestsSent
// 								.map(function(x) {
// 									return x._id.toString();
// 								})
// 								.indexOf(req.params.userId);
// 							console.log('elementPos', elementPos);
// 							// on retire de la liste des demandes envoyées du buddy requestor, le buddy qui vient d'accepter la demande
// 							buddy.account.buddiesRequestsSent.splice(elementPos, 1);
// 							console.log('req.params.userId', req.params.userId);
// 							console.log('elementPos', elementPos);
// 							console.log('buddy.account.buddies', buddy.account.buddies);
// 							// on créé un objet du user qui a fait la demande
// 							var requestingBuddy = {};
// 							requestingBuddy._id = buddy._id;
// 							requestingBuddy.isBuddy = true;
// 							requestingBuddy.requestSentBy = buddy._id;
// 							requestingBuddy.addedAt = new Date();
// 							// on pousse le requesting buddy dans la liste des amis du user qui accepte
// 							user.account.buddies.push(requestingBuddy);

// 							// on créé un objet du user qui accepte la demande
// 							var acceptingBuddy = {};
// 							acceptingBuddy._id = user._id;
// 							acceptingBuddy.isBuddy = true;
// 							acceptingBuddy.requestAcceptedBy = user._id;
// 							acceptingBuddy.addedAt = new Date();
// 							// on pousse l'accepting buddy dans la liste des amis du user qui a fait la demande
// 							buddy.account.buddies.push(acceptingBuddy);
// 							buddy.save(function(err, obj) {});
// 							user.save(function(err, obj) {
// 								res.send('OK la buddy request a été acceptée');
// 							});
// 						}
// 					}
// 				);
// 			}
// 		}
// 	);
// });

// router.post('/:userId/cancelBuddyRequest/:buddyId', function(req, res, next) {
// 	// on cherche le user connecté, celui qui veut annuler sa demande
// 	User.findOne(
// 		{
// 			_id: req.params.userId
// 		},
// 		function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log(
// 					user.account.username, // simon
// 					' va annuler sa demande à ',
// 					req.params.buddyId // kikie
// 				);
// 				// on retire de la liste des buddiesRequestsSent le user pour lequel on a annulé la demande
// 				user.account.buddiesRequestsSent.splice(
// 					user.account.buddiesRequestsSent.indexOf(req.params.buddyId),
// 					1
// 				);
// 				// on retire dans la liste des requestReceived la request venant de la personne qui a annulé
// 				//
// 				User.findOne(
// 					{
// 						_id: req.params.buddyId
// 					},
// 					function(err, buddy) {
// 						// on trouve le buddy pour lequel le user annule sa demande d'amis
// 						if (err) {
// 							console.log(err);
// 						} else {
// 							var elementPos = buddy.account.buddiesRequestsReceived
// 								.map(function(x) {
// 									return x._id.toString();
// 								})
// 								.indexOf(req.params.userId);
// 							console.log('elementPos', elementPos);
// 							// on retire de la liste des demandes d'amis reçues, l'id du user qui vient d'annuler
// 							buddy.account.buddiesRequestsReceived.splice(elementPos, 1);
// 							console.log('req.params.userId', req.params.userId);
// 							console.log('elementPos', elementPos);
// 							console.log('buddy.account.buddies', buddy.account.buddies);
// 							buddy.save(function(err, obj) {});
// 							user.save(function(err, obj) {
// 								res.send('OK la buddy request a été annulée');
// 							});
// 						}
// 					}
// 				);
// 			}
// 		}
// 	);
// });

// router.post('/:userId/refuseBuddyRequest/:buddyId', function(req, res, next) {
// 	// on cherche le user connecté, celui qui veut refuser la demande
// 	User.findOne(
// 		{
// 			_id: req.params.userId
// 		},
// 		function(err, user) {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log(
// 					user.account.username, // kikie
// 					' va refuser la demande de ',
// 					req.params.buddyId // simon
// 				);
// 				// on retire de la liste des buddiesRequestsReceived le user qui vient d'être refusé
// 				console.log('user.account.buddiesRequestsReceived', user.account.buddiesRequestsReceived);
// 				user.account.buddiesRequestsReceived.splice(
// 					user.account.buddiesRequestsReceived.indexOf(req.params.buddyId),
// 					1
// 				);
// 				// on ajoute à la liste des buddies, le buddy qui a fait la request et on lui donne le statut accepted, on ajoute la propriété addedBy avec l'id du requestor
// 				//
// 				User.findOne(
// 					{
// 						_id: req.params.buddyId
// 					},
// 					function(err, buddy) {
// 						// dans le compte du demandeur, on change le statut du demandé de requested à accepted.
// 						if (err) {
// 							console.log(err);
// 						} else {
// 							var elementPos = buddy.account.buddiesRequestsSent
// 								.map(function(x) {
// 									return x._id.toString();
// 								})
// 								.indexOf(req.params.userId);
// 							console.log('elementPos', elementPos);
// 							// on retire de la liste des demandes envoyées du buddy requestor, le buddy qui vient d'accepter la demande
// 							buddy.account.buddiesRequestsSent.splice(elementPos, 1);
// 							console.log('req.params.userId', req.params.userId);
// 							console.log('elementPos', elementPos);
// 							console.log('buddy.account.buddies', buddy.account.buddies);
// 							buddy.save(function(err, obj) {});
// 							user.save(function(err, obj) {
// 								res.send('OK la buddy request a été refusée');
// 							});
// 						}
// 					}
// 				);
// 			}
// 		}
// 	);
// });

// router.post('/:userId/removeBuddy/:buddyId', function(req, res, next) {
// 	// on cherche le user connecté, celui qui retirer le buddy de ses amis
// 	User.findOne(
// 		{
// 			_id: req.params.userId
// 		},
// 		(err, user) => {
// 			if (err) {
// 				console.log(err);
// 			} else {
// 				console.log(
// 					user.account.username, // kikie
// 					' va retirer ',
// 					req.params.buddyId,
// 					' de ses buddies :(' // simon
// 				);
// 				// on retire de la liste des buddies le user qui vient d'être supprimé
// 				console.log('user.account.buddies', user.account.buddies);
// 				user.account.buddies.splice(user.account.buddies.indexOf(req.params.buddyId), 1);
// 				// on cherche le buddy qui vient d'être supprimé
// 				//
// 				User.findOne(
// 					{
// 						_id: req.params.buddyId
// 					},
// 					function(err, buddy) {
// 						// dans le compte du buddy supprimé on retire le suppresseur de la liste d'amis
// 						if (err) {
// 							console.log(err);
// 						} else {
// 							var elementPos = buddy.account.buddies
// 								.map(function(x) {
// 									return x._id.toString();
// 								})
// 								.indexOf(req.params.userId);
// 							console.log('elementPos', elementPos);
// 							// on retire de la liste des demandes envoyées du buddy requestor, le buddy qui vient d'accepter la demande
// 							buddy.account.buddies.splice(elementPos, 1);
// 							console.log('req.params.userId', req.params.userId);
// 							console.log('elementPos', elementPos);
// 							console.log('buddy.account.buddies', buddy.account.buddies);
// 							buddy.save(function(err, obj) {});
// 							user.save(function(err, obj) {
// 								res.send('OK le buddy a été supprimé :(');
// 							});
// 						}
// 					}
// 				);
// 			}
// 		}
// 	);
// });
