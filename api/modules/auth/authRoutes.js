module.exports = app => {
	const Ctrl = require('./authController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	// signup route
	app.route('/api/v1/auth/signup').post(Ctrl.signupPost);
	/**
 * @swagger
  * /v1/auth/signup:
  *    post: 
  *     tags:
  *     - auth
  *     summary: Sign up an account
  *     operationId: signUp
  *     consumes:
  *     - application/x-www-form-urlencoded
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
  *         description: Sign Up Success
  *       400:
  *         description: Sign Up Error
*/
	app.route('/api/v1/auth/login').post(Ctrl.loginPost);
	/**
 * @swagger
  * /v1/auth/login:
  *    post: 
  *     tags:
  *     - auth
  *     summary: Login to account
  *     operationId: logIn
  *     consumes:
  *     - application/x-www-form-urlencoded
  *     produces:
  *     - application/json
  *     parameters:
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
  *         description: Login Success
  *       400:
  *         description: Login Error
*/
	// app.route('/api/v1/movies/:id([a-fA-F\\d]{24})').get(Ctrl.read);
};
