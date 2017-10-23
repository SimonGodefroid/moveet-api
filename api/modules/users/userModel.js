const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
// const passportLocalMongoose = require('passport-local-mongoose');
const schemaOptions = {
	timestamps: true,
	toJSON: {
		virtuals: true
	}
};
const UserSchema = new mongoose.Schema(
	{
		shortId: Number,
		email: { type: String, unique: true },
		password: String,
		passwordResetToken: String,
		passwordResetExpires: Date,
		token: String,
		account: {
			username: {
				type: String,
				unique: true,
				required: true
			},
			favorites: [
				{
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Movie'
				}
			],
			subscription: String,
			age: Number,
			gender: String,
			description: String,
			picture: String,
			location: {
				latitude: Number,
				longitude: Number,
				timestamp: Number
			},
			loc: { type: { type: String }, coordinates: [Number] },
			buddies: [
				{
					_id: {
						type: mongoose.Schema.Types.ObjectId,
						ref: 'User'
					}
				}
			]
		},
		messages: [
			{
				id_speaker: mongoose.Schema.Types.ObjectId,
				id_message: mongoose.Schema.Types.ObjectId
			}
		],
		swipeLike: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Movie'
			}
		],
		swipePass: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Movie'
			}
		],
		cId: String
	},
	schemaOptions
);

UserSchema.index({ loc: '2dsphere' });
// UserSchema.plugin(passportLocalMongoose, {
// usernameField: 'email', // L'authentification utilisera `email` plutôt `username`
// session: false // L'API ne nécessite pas de sessions
// });

UserSchema.pre('save', function(next) {
	var user = this;
	if (!user.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(user.password, salt, null, function(err, hash) {
			user.password = hash;
			next();
		});
	});
});

UserSchema.methods.comparePassword = function(password, cb) {
	bcrypt.compare(password, this.password, function(err, isMatch) {
		cb(err, isMatch);
	});
};

UserSchema.virtual('gravatar').get(function() {
	if (!this.get('email')) {
		return 'https://gravatar.com/avatar/?s=200&d=retro';
	}
	var md5 = crypto
		.createHash('md5')
		.update(this.get('email'))
		.digest('hex');
	return 'https://gravatar.com/avatar/' + md5 + '?s=200&d=retro';
});

UserSchema.options.toJSON = {
	transform: function(doc, ret, options) {
		delete ret.password;
		delete ret.passwordResetToken;
		delete ret.passwordResetExpires;
	}
};

// // Cette méthode sera utilisée par la strategie `passport-local` pour trouver un utilisateur en fonction de son `email` et `password`
// UserSchema.statics.authenticateLocal = function() {
// 	var _self = this;
// 	return function(req, email, password, cb) {
// 		_self.findByUsername(email, true, (err, user) => {
// 			if (err) return cb(err);
// 			if (user) {
// 				return user.authenticate(password, cb);
// 			} else {
// 				return cb(null, false);
// 			}
// 		});
// 	};
// };

// // Cette méthode sera utilisée par la strategie `passport-http-bearer` pour trouver un utilisateur en fonction de son `token`
// UserSchema.statics.authenticateBearer = () => {
// 	var _self = this;
// 	return (token, cb) => {
// 		if (!token) {
// 			cb(null, false);
// 		} else {
// 			_self.findOne(
// 				{
// 					token: token
// 				},
// 				(err, user) => {
// 					if (err) return cb(err);
// 					if (!user) return cb(null, false);
// 					return cb(null, user);
// 				}
// 			);
// 		}
// 	};
// };

module.exports = mongoose.model('User', UserSchema, 'users');
