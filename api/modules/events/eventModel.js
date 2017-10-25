const mongoose = require('mongoose');
// TBD
const EventSchema = new mongoose.Schema({
	code: Number
});

module.exports = mongoose.model('Event', EventSchema, 'events');
