(() => {
	'use strict';
	const Global = require('../../../Global');
	module.exports = acl => {
		return {
			list: (req, res) => {
				allocine.api(
					'showtimelist',
					{
						movie: req.query.movie,
						count: !req.query.count ? 100 : req.query.count,
						lat: req.query.lat,
						long: req.query.long,
						radius: !req.query.radius ? 40 : req.query.radius,
						theaters: !req.query.theaters ? '' : req.query.theaters
					},
					(e, results) => {
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
