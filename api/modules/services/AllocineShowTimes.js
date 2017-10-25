var crypto = require('crypto'),
	http = require('http');
var allocine = function() {
	this.config = {
		apiHostName: 'api.allocine.fr', // url de l'host
		apiBasePath: '/rest/v3/', // path de l'api
		apiPartner: 'V2luZG93czg', // clé API
		//apiPartner: "QUNXZWItQWxsb0Npbuk", // clé API

		apiSecretKey: 'e2b7fd293906435aa5dac4be670e7982', // clé secrète
		imgBaseUrl: 'http://images.allocine.fr', // url pour les images
		userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; MSAppHost/1.0)'
	};

	this.presets = {
		global: {
			partner: this.config.apiPartner,
			format: 'json'
		},
		showtimelist: {
			zip: '',
			movie: '',
			count: '',
			lat: '',
			long: '',
			radius: '',
			theaters: '',
			code: ''
		},
		movielist: {
			profile: 'large'
		},
		movie: {
			profile: 'large'
		},
		tvserieslist: {
			filter: 'top',
			order: 'viewcount'
		},
		tvseries: {
			profile: 'large'
		},
		tvseriesbroadcastlist: {
			profile: 'large'
		},
		season: {
			profile: 'large'
		},
		seasonlist: {
			profile: 'small'
		},
		news: {
			profile: 'large'
		},
		newslist: {
			profile: 'large'
		},
		media: {
			mediafmt: 'mp4'
		},
		feature: {
			profile: 'large'
		},
		featurelist: {
			profile: 'large'
		},
		picturelist: {
			profile: 'large'
		},
		videolist: {
			mediafmt: 'mp4'
		},
		search: {
			filter: 'movie,tvseries,theater,news,video'
		}
	};

	// Extend an object with other objects
	this.extend = function(dst) {
		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i] !== dst) {
				for (var key in arguments[i]) {
					dst[key] = arguments[i][key];
				}
			}
		}
		return dst; // dst est un objet qui contient les clefs et valeurs: partner, format, filter et q
	};

	// Build path for accessing Allocine API
	this.buildPath = function(route, params) {
		var path = this.config.apiBasePath + route;
		// Extend params with route presets
		params = this.extend({}, this.presets.global, this.presets[route], params);
		console.log('params', params); // params ce sont les paramètres passés à l'API

		if (params) {
			var tokens = [];

			// Fill the tokens array and sort it
			for (var param in params) {
				tokens.push(param + '=' + encodeURIComponent(params[param]));
			}
			tokens.sort();

			path += '?' + tokens.join('&');

			// Build and encode path
			var date = new Date();
			var sed =
				date.getFullYear() +
				'' +
				('0' + (date.getMonth() + 1)).slice(-2) +
				'' +
				('0' + date.getDate()).slice(-2);
			var sig = this.config.apiSecretKey + tokens.join('&') + '&sed=' + sed;
			console.log('sig at first', sig);
			// Hash "sig" parameter
			var shasum = crypto.createHash('sha1');
			sig = encodeURIComponent(shasum.update(sig, 'utf-8').digest('base64'));
			console.log('url de la requête', path + '&sed=' + sed + '&sig=' + sig);
			return path + '&sed=' + sed + '&sig=' + sig;
		}
		return path;
	};

	// Request the API with the given path
	this.request = function(path, callback) {
		var options = {
			hostname: this.config.apiHostName,
			path: path,
			headers: {
				'User-Agent': this.config.userAgent
			}
		};
		if (this.config.proxyHostName) {
			options.path = 'http://' + options.hostname + options.path;
			options.port = this.config.proxyPort;
			options.hostname = this.config.proxyHostName;
		}

		// Call the API, fetch returned data and pass it to the callback
		http
			.get(options, function(res) {
				if (res.statusCode === 200) {
					var data = '';
					var headerContentLength = parseInt(res.headers['content-length'], 10);
					var dataContentLength = 0;
					res.on('data', function(chunk) {
						data += chunk;
						dataContentLength += chunk.length;
					});

					res.on('end', function() {
						// Verify the length of received data (perhaps not the declared size)
						if (!isNaN(headerContentLength) && headerContentLength !== dataContentLength) {
							return callback('Invalid size ' + dataContentLength + '/' + headerContentLength);
						}
						// TODO : better error handling, if data contains "error" will be catch as error
						if (/<error.*>/i.test(data)) {
							callback(data, {});
						} else {
							// Success
							callback(null, JSON.parse(data));
						}
					});
				} else {
					// Error
					callback(res.statusCode, {});
				}
			})
			.on('error', function(e) {
				// Error, we need the error, not the message, to understand what is the problem !  (Timeout ?)
				callback(e, {});
			});
	};

	// Main method, used to call the API
	this.api = function(method, options, callback) {
		var path = this.buildPath(method, options);
		this.request(path, callback);
	};

	this.setProxy = function(proxyHostName, proxyPort) {
		this.config.proxyHostName = proxyHostName;
		this.config.proxyPort = proxyPort;
	};

	return this;
};

module.exports = new allocine();
