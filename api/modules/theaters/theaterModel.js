const mongoose = require('mongoose');

const TheaterSchema = new mongoose.Schema({
	code: String,
	name: String,
	address: String,
	postalCode: String,
	city: String,
	area: String,
	cinemaChain: { code: Number, $: String },
	screenCount: Number,
	geoloc: {
		lat: Number,
		long: Number
	},
	picture: {
		path: String,
		href: String
	},
	hasEvent: Number,
	hasPRMAccess: Number,
	openToExternalSales: Number,
	link: [{ rel: String, href: String }]
});

module.exports = mongoose.model('Theater', TheaterSchema, 'theaters');
