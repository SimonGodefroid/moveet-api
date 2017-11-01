const request = require('request');
const jsonfile = require('jsonfile');
const jsonAllMovieTheaters = './save/tmp/allMovieTheaters.json';

request(
	'http://api.allocine.fr/rest/v3/theaterlist?partner=YW5kcm9pZC12Mg&zip=75000&radius=2000&count=3000&profile=large&format=json',
	(error, response, body) => {
		if (!error && response.statusCode == 200) {
			console.log('saving the all the movie theaters');
			const result = JSON.parse(body);

			jsonfile.writeFile(jsonAllMovieTheaters, result.feed, err => {
				if (err !== null) {
					console.error(err);
				} else {
					console.log('JSON saved with ' + result.feed.totalResults + ' movies theaters');
				}
			});
		} else {
			console.log(error);
		}
	}
);
