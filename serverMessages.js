// Le package `dotenv` permet de pouvoir definir des variables d'environnement dans le fichier `.env`
// Nous utilisons le fichier `.slugignore` afin d'ignorer le fichier `.env` dans l'environnement Heroku
require("dotenv").config();

// Le package `mongoose` est un ODM (Object-Document Mapping) permettant de manipuler les documents de la base de données comme si c'étaient des objets
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) console.error("Could not connect to mongodb.");
  console.log("CHAT $ on est connectés à la DB");
  //console.log("CHAT $ process.env", process.env);
});

// var WebSocketServer = require('ws').Server;
// var wss = new WebSocketServer({port: 3000});

var express = require("express");
var app = express();

// Le package `helmet` est une collection de protections contre certaines vulnérabilités HTTP
var helmet = require("helmet");
app.use(helmet());

// Les réponses (> 1024 bytes) du serveur seront compressées au format GZIP pour diminuer la quantité d'informations transmise
var compression = require("compression");
app.use(compression());

// Parse le `body` des requêtes HTTP reçues
var bodyParser = require("body-parser");
app.use(bodyParser.json());

app.get("/chat", function(req, res) {
  res.json({
    chat: "starting chat"
  });
});

// --- Socket
var server = require("http").createServer(app);
var io = require("socket.io")(server);

var Message = require("./models/Message");
var User = require("./models/User");

// Store conversation in Users DB
function insertNewTalk(user_id, buddy_id) {
  console.log("coucou insert new");
  console.log("user_id", user_id);
  console.log("buddy_id", buddy_id);
  Message.findOne({
    id_user: user_id,
    id_buddy: buddy_id
  })
    .exec()
    .then(function(talk) {
      console.log("insert new talk%talk", talk);
      console.log("insertNewTalk talk._id ", talk._id);
      User.findOneAndUpdate(
        {
          _id: user_id
        },
        {
          $push: {
            "account.messages": {
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
            "account.messages": {
              id_speaker: user_id,
              id_message: talk._id
            }
          }
        }
      ).exec();

      io.emit("serverloadsMessages", talk);
    });
} // insertNewTalk

function setTalk(talk_id, cb) {
  Message.findById(talk_id).exec().then(cb);
} // setTalk

io.on("connection", function(client) {
  // le serveur reçoit tous les évènement du client
  client.on("clientGetMessages", function(speakers) {
    console.log("clientGetMessages server received user", speakers.userId);
    console.log(
      "clientGetMessages server received speaker",
      speakers.speakerId
    );
    User.findById(speakers.userId)
      .where({
        "account.messages": {
          $elemMatch: {
            id_speaker: speakers.speakerId
          }
        }
      })
      .exec()
      .then(function(user) {
        console.log(" is user found? ", user === null ? false : true);
        if (user) {
          console.log("user was found on récupère ses messages");
          let talk_id = null;
          user.account.messages.forEach(function(element) {
            if (speakers.speakerId == element.id_speaker) {
              talk_id = element.id_message;
            }
          }); // forEach

          setTalk(talk_id, talk => {
            console.log("setTalk cb talk ", talk);
            io.emit("serverloadsMessages", talk);
          });
          return;
        } else {
          console.log("on n a pas trouvé le user, donc c est son premier talk");

          const user = speakers.userId;
          const buddy = speakers.speakerId;
          // Create a new entry in Message DB
          // on créé un message dans la collection message
          console.log("premier message en entre ", user, "et", buddy);
          const talk = new Message({
            id_user: user,
            id_buddy: buddy,
            messages: []
          });
          talk.save().then(function() {
            console.log("talk save,  user", user);
            console.log("talk save,  buddy", buddy);
            insertNewTalk(user, buddy);
          });
        } // else
      });
  });

  client.on("clientSendsMessage", function(messageSent) {
    console.log("server recieved message ", messageSent);
    var talk_id = mongoose.mongo.ObjectId(messageSent.talk_id);
    console.log("talk_id", talk_id);
    Message.findByIdAndUpdate(talk_id, {
      $push: {
        messages: messageSent.message
      }
    })
      .exec()
      .then(function() {
        Message.findById(talk_id).exec().then(function(talk) {
          console.log("AfterPush ", talk.messages);
          io.emit("serverSendsMessage", talk.messages);
        });
      });
  });
});

server.listen(3000, function() {
  console.log(`Moveet chat running on port 3000`);
});

// for prod
// server.listen(process.env.PORT, function() {
//   console.log(`Moveet chat running on port ${process.env.PORT}`);
// });
