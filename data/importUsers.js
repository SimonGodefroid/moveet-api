require('dotenv').config();
const request = require('request');
const uid2 = require('uid2');
const mongoose = require('mongoose');
const _ = require('lodash');
const jsonfile = require('jsonfile');
const jsonFailedRequests = '../save/tmp/failedRequests.json';
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, err => {
	if (err) {
		console.error('Could not connect to mongodb.');
	}
});

const User = require('../api/modules/users/userModel');
const Movie = require('../api/modules/movies/movieModel');
const users = require('./users.json');

let failedRequests = [];
let i = 1;

users.forEach(user => {
	Movie.find({ code: { $in: user.account.favorites } }, (err, movies) => {
		if (err) {
			console.log(err);
		} else {
			User.register(
				new User({
					email: user.account.username.toLowerCase() + '@moveet.com',
					token: uid2(16),
					account: {
						username: user.account.username,
						favorites: movies,
						age: user.account.age,
						description: user.account.description,
						gender: user.account.gender,
						subscription: user.account.subscription,
						picture: user.account.picture,
						location: user.account.location
					}
				}),
				'password01', // Le mot de passe doit être obligatoirement le deuxième paramètre transmis à `register` afin d'être crypté
				(err, obj) => {
					if (err) {
						console.error(err);
						console.log('erreur dans le save');
					} else {
						console.log('saved user ' + obj.account.username, i, ' out of', users.length);
						i++;
					}
					if (i === users.length - 1) {
						console.log('stop');
						setTimeout(() => {
							console.log("c'est fini");
							mongoose.connection.close();
						}, 15000);
					}
				}
			);
		}
	});
});
