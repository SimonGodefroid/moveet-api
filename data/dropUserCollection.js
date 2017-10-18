require("dotenv").config();
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, function(err) {
  if (err) {
    console.error("Could not connect to mongodb.");
  }
  mongoose.connection.db.dropCollection("users", function(err, result) {
    if (err) {
      console.log("Could not drop user collection");
    } else {
      console.log("Dropped user collection");
    }
  });
  mongoose.connection.close();
});
