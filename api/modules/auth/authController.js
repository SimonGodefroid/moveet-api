// CONTROLLERS
(() => {
	'use strict';
	const User = require('../users/userModel'),
		async = require('async'),
		crypto = require('crypto'),
		nodemailer = require('nodemailer'),
		jwt = require('jsonwebtoken'),
		moment = require('moment'),
		request = require('request'),
		qs = require('querystring');
	module.exports = acl => {
		const generateToken = user => {
			const payload = {
				iss: 'my.domain.com',
				sub: user.id,
				iat: moment().unix(),
				exp: moment()
					.add(7, 'days')
					.unix()
			};
			return jwt.sign(payload, process.env.TOKEN_SECRET);
		};

		return {
			ensureAuthenticated: (req, res, next) => {
				if (req.isAuthenticated()) {
					next();
				} else {
					res.status(401).send({ msg: 'Unauthorized' });
				}
			},
			loginPost: (req, res, next) => {
				console.log('req.body', req.body);
				// req.assert('email', 'Email is not valid').isEmail();
				// req.assert('email', 'Email cannot be blank').notEmpty();
				// req.assert('password', 'Password cannot be blank').notEmpty();
				// req.sanitize('email').normalizeEmail({ remove_dots: false });
				var errors = req.validationErrors();
				if (errors) {
					return res.status(400).send(errors);
				}
				User.findOne({ email: req.body.email }, (err, user) => {
					console.log('coucou login');
					if (!user) {
						return res.status(401).send({
							msg:
								'The email address ' +
								req.body.email +
								' is not associated with any account. ' +
								'Double-check your email address and try again.'
						});
					}
					user.comparePassword(req.body.password, (err, isMatch) => {
						if (!isMatch) {
							return res.status(401).send({ msg: 'Invalid email or password' });
						}
						res.send({ token: generateToken(user), user: user.toJSON() });
					});
				});
			},
			signupPost: (req, res) => {
				req.assert('name', 'Name cannot be blank').notEmpty();
				req.assert('email', 'Email is not valid').isEmail();
				req.assert('email', 'Email cannot be blank').notEmpty();
				req.assert('password', 'Password must be at least 4 characters long').len(4);
				req.sanitize('email').normalizeEmail({ remove_dots: false });
				var errors = req.validationErrors();
				if (errors) {
					return res.status(400).send(errors);
				}
				User.findOne({ email: req.body.email }, (err, user) => {
					if (user) {
						return res.status(400).send({
							success: false,
							message: 'The email address you have entered is already associated with another account.'
						});
					}
					user = new User({
						account: { username: req.body.name },
						email: req.body.email,
						password: req.body.password
					});
					user.save(err => {
						console.log('coucou user save', err);
						res.send({ token: generateToken(user), user: user });
					});
				});
			},
			accountPut: (req, res) => {
				if ('password' in req.body) {
					req.assert('password', 'Password must be at least 4 characters long').len(4);
					req.assert('confirm', 'Passwords must match').equals(req.body.password);
				} else {
					req.assert('email', 'Email is not valid').isEmail();
					req.assert('email', 'Email cannot be blank').notEmpty();
					req.sanitize('email').normalizeEmail({ remove_dots: false });
				}
				var errors = req.validationErrors();
				if (errors) {
					return res.status(400).send(errors);
				}
				User.findById(req.user.id, (err, user) => {
					if ('password' in req.body) {
						user.password = req.body.password;
					} else {
						user.email = req.body.email;
						user.name = req.body.name;
						user.gender = req.body.gender;
						user.location = req.body.location;
						user.website = req.body.website;
					}
					user.save(err => {
						if ('password' in req.body) {
							res.send({ msg: 'Your password has been changed.' });
						} else if (err && err.code === 11000) {
							res.status(409).send({
								msg: 'The email address you have entered is already associated with another account.'
							});
						} else {
							res.send({ user: user, msg: 'Your profile information has been updated.' });
						}
					});
				});
			},
			delete: (req, res) => {
				User.remove({ _id: req.user.id }, err => {
					res.send({ msg: 'Your account has been permanently deleted.' });
				});
			}
		};
	};
})();
