module.exports = app => {
	const Ctrl = require('./authController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	app.route('/api/v1/auth/signup').post(Ctrl.signupPost);
	// app.route('/api/v1/movies/:id([a-fA-F\\d]{24})').get(Ctrl.read);
};
