require('dotenv').config();
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, err => {
	if (err) {
		console.error('Could not connect to mongodb.');
	}
	mongoose.connection.db.dropCollection('users', (err, result) => {
		if (err) {
			console.log('Could not drop user collection');
		} else {
			console.log('Dropped user collection');
		}
	});
	mongoose.connection.close();
});
