// Nous utilisons le fichier `.slugignore` afin d'ignorer le fichier `.env` dans l'environnement Heroku
require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
	if (err) console.error('Could not connect to mongodb.');
	console.log('CHAT $ on est connectés à la DB');
	//console.log("CHAT $ process.env", process.env);
});

// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port: 3000});

const express = require('express');
const app = express();
const helmet = require('helmet');
const compression = require('compression');
const bodyParser = require('body-parser');
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

app.get('/chat', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'starting chat'
	});
});

// --- Socket
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Message = require('./api/modules/messages/messageModel');
const User = require('./api/modules/users/userModel');

// Store conversation in Users DB
const insertNewTalk = (user_id, buddy_id) => {
	console.log('coucou insert new');
	console.log('user_id', user_id);
	console.log('buddy_id', buddy_id);
	Message.findOne({
		id_user: user_id,
		id_buddy: buddy_id
	})
		.exec()
		.then(talk => {
			console.log('insert new talk%talk', talk);
			console.log('insertNewTalk talk._id ', talk._id);
			User.findOneAndUpdate(
				{
					_id: user_id
				},
				{
					$push: {
						'account.messages': {
							id_speaker: buddy_id,
							id_message: talk._id
						}
					}
				}
			).exec();

			User.findOneAndUpdate(
				{
					_id: buddy_id
				},
				{
					$push: {
						'account.messages': {
							id_speaker: user_id,
							id_message: talk._id
						}
					}
				}
			).exec();

			io.emit('serverloadsMessages', talk);
		});
}; // insertNewTalk

const setTalk = (talk_id, cb) => {
	Message.findById(talk_id)
		.exec()
		.then(cb);
}; // setTalk

io.on('connection', client => {
	// le serveur reçoit tous les évènement du client
	client.on('clientGetMessages', speakers => {
		console.log('clientGetMessages server received user', speakers.userId);
		console.log('clientGetMessages server received speaker', speakers.speakerId);
		User.findById(speakers.userId)
			.where({
				'account.messages': {
					$elemMatch: {
						id_speaker: speakers.speakerId
					}
				}
			})
			.exec()
			.then(user => {
				console.log(' is user found? ', user === null ? false : true);
				if (user) {
					console.log('user was found on récupère ses messages');
					let talk_id = null;
					user.account.messages.forEach(element => {
						if (speakers.speakerId == element.id_speaker) {
							talk_id = element.id_message;
						}
					}); // forEach

					setTalk(talk_id, talk => {
						console.log('setTalk cb talk ', talk);
						io.emit('serverloadsMessages', talk);
					});
					return;
				} else {
					console.log('on n a pas trouvé le user, donc c est son premier talk');

					const user = speakers.userId;
					const buddy = speakers.speakerId;
					// Create a new entry in Message DB
					// on créé un message dans la collection message
					console.log('premier message en entre ', user, 'et', buddy);
					const talk = new Message({
						id_user: user,
						id_buddy: buddy,
						messages: []
					});
					talk.save().then(() => {
						console.log('talk save,  user', user);
						console.log('talk save,  buddy', buddy);
						insertNewTalk(user, buddy);
					});
				} // else
			});
	});

	client.on('clientSendsMessage', messageSent => {
		console.log('server recieved message ', messageSent);
		var talk_id = mongoose.mongo.ObjectId(messageSent.talk_id);
		console.log('talk_id', talk_id);
		Message.findByIdAndUpdate(talk_id, {
			$push: {
				messages: messageSent.message
			}
		})
			.exec()
			.then(() => {
				Message.findById(talk_id)
					.exec()
					.then(talk => {
						console.log('AfterPush ', talk.messages);
						io.emit('serverSendsMessage', talk.messages);
					});
			});
	});
});

server.listen(3000, () => {
	console.log(`Moveet chat running on port 3000`);
});

// for prod
// server.listen(process.env.PORT, function() {
//   console.log(`Moveet chat running on port ${process.env.PORT}`);
// });
