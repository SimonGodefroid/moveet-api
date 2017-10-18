var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var MessageSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Message", MessageSchema, "messages");
