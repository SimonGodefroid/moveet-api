const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const MessageSchema = new mongoose.Schema({
	id_user: Schema.ObjectId,
	id_buddy: Schema.ObjectId,
	other: String,
	// chatId: Number,
	messages: [
		{
			text: String,
			createdAt: Date,
			user: {
				_id: Schema.ObjectId,
				name: String,
				avatar: String
			}
		}
	]
});

module.exports = mongoose.model('Message', MessageSchema, 'messages');
