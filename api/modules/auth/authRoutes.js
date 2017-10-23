module.exports = app => {
	const Ctrl = require('./authController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	// signup route
	app.route('/api/v1/auth/signup').post(Ctrl.signupPost);
	/**
 * @swagger
  * /v1/auth/signup:
  *    get: 
  *     tags:
  *     - auth
  *     summary: Sign up an account
  *     operationId: signUp
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: formData
  *       name: account.username
  *       required: true
  *       type: string
  *     - in: formData
  *       name: email
  *       required: true
  *       type: string
  *     - in: formData
  *       name: password
  *       required: true
  *       type: string
  *     responses:
  *       200:
  *         description: Fetched movies
  *       400:
  *         description: Error
*/
	// app.route('/api/v1/movies/:id([a-fA-F\\d]{24})').get(Ctrl.read);
};
