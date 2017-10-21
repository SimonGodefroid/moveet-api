const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
	shortId: Number, // un shortId nous est utile au moment de l'importation du jeu de données `npm run data` car les relations y sont identifiées à l'aide d'identifiants courts
	email: String,
	password: String,
	token: String, // Le token permettra d'authentifier l'utilisateur à l'aide du package `passport-http-bearer`

	// Nous choisisons de créer un objet `account` dans lequel nous stockerons les informations non sensibles
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
		genre: String,
		description: String,
		picture: String,
		location: {
			latitude: Number,
			longitude: Number,
			timestamp: Number
		},

		buddies: [
			{
				_id: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				},
				isBuddy: Boolean,
				requestAcceptedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				},
				requestSentBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				},
				status: String
			}
		],
		buddiesRequestsSent: [
			{
				buddyId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				},
				isBuddy: Boolean,
				created: {
					type: Date,
					default: Date.now
				},
				status: String,
				requestedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				}
			}
		],
		buddiesRequestsReceived: [
			{
				buddyId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				},
				isBuddy: Boolean,
				created: {
					type: Date,
					default: Date.now
				},
				status: String,
				addedBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User'
				}
			}
		],
		messages: [
			{
				id_speaker: mongoose.Schema.Types.ObjectId,
				id_message: mongoose.Schema.Types.ObjectId
			}
		],
		moviesSwiperLiked: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Movie'
			}
		],
		moviesSwiperDisliked: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Movie'
			}
		],
		moviesSwiperDeck: Array
	},
	cId: String
});

UserSchema.plugin(passportLocalMongoose, {
	usernameField: 'email', // L'authentification utilisera `email` plutôt `username`
	session: false // L'API ne nécessite pas de sessions
});

// Cette méthode sera utilisée par la strategie `passport-local` pour trouver un utilisateur en fonction de son `email` et `password`
UserSchema.statics.authenticateLocal = function() {
	var _self = this;
	return function(req, email, password, cb) {
		_self.findByUsername(email, true, (err, user) => {
			if (err) return cb(err);
			if (user) {
				return user.authenticate(password, cb);
			} else {
				return cb(null, false);
			}
		});
	};
};

// Cette méthode sera utilisée par la strategie `passport-http-bearer` pour trouver un utilisateur en fonction de son `token`
UserSchema.statics.authenticateBearer = () => {
	var _self = this;
	return (token, cb) => {
		if (!token) {
			cb(null, false);
		} else {
			_self.findOne(
				{
					token: token
				},
				(err, user) => {
					if (err) return cb(err);
					if (!user) return cb(null, false);
					return cb(null, user);
				}
			);
		}
	};
};

module.exports = mongoose.model('User', UserSchema, 'users');
