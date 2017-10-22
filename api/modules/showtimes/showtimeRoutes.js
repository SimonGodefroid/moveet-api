module.exports = app => {
	const Ctrl = require('./movieController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	app.route('/api/v1/showtimes').get(Ctrl.list);
};
