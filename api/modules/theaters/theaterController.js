(() => {
	'use strict';
	const Theater = require('./theaterModel'),
		request = require('request-promise');
	module.exports = acl => {
		return {
			list: (req, res) => {
				Theater.find({})
					.exec()
					.then(theaters => {
						return res.status(200).json({
							success: true,
							count: theaters.length,
							message: theaters
						});
					})
					.catch(err => {
						console.log('err', err);
						return res.status(500).json({ success: false, message: err });
					});
			},
			read: (req, res) => {
				let query = [{ $match: { _id: mongoose.Types.ObjectId(req.params.id) } }];
				Theater.aggregate(query)
					.exec()
					.then(theaters => {
						let result = theaters;
						if (theaters.length > 0) {
							result = theaters[0];
						}
						return res.status(200).json({
							success: true,
							message: result
						});
					})
					.catch(err => {
						console.log('err', err);
						return res.status(500).json({ success: false, message: err });
					});
			},
			find: (req, res) => {
				let queryUrl = `http://api.allocine.fr/rest/v3/theaterlist?partner=YW5kcm9pZC12Mg&lat=${req.query
					.lat}&long=${req.query.long}&zip=${req.query.zip}&radius=20&count=100&format=json`;
				return request(queryUrl)
					.then(json => {
						const result = JSON.parse(body);
						return res.status(200).json({
							success: true,
							theaters: result.feed.theater
						});
					})
					.catch(err => {
						return res.status(500).json({
							success: false,
							message: err
						});
					});
			}
		};
	};
})();
