(() => {
	'use strict';
	// const Global = require('../../../Global');
	const allocine = require('../services/AllocineShowTimes');
	module.exports = acl => {
		return {
			list: (req, res) => {
				let movie = req.query.movie;
				let count = !req.query.count ? 100 : parseInt(req.query.count);
				let zip = !req.query.zip ? '' : req.query.zip;
				let lat = !req.query.lat ? 0 : req.query.lat;
				let long = !req.query.long ? 0 : req.query.long;
				let radius = !req.query.radius ? 40 : parseInt(req.query.radius);
				let theaters = !req.query.theaters ? '' : req.query.theaters;
				allocine.api(
					'showtimelist',
					{
						movie: movie,
						count: count,
						zip: zip,
						lat: lat,
						long: long,
						radius: radius,
						theaters: theaters
					},
					(err, results) => {
						if (err) {
							console.log('Error : ' + err);
							return res.status(500).json({ succes: false, message: err });
						}
						res.status(200).json({
							success: true,
							message: results,
							radius: !req.query.radius ? 40 : req.query.radius
						});
					}
				);
			}
		};
	};
})();
