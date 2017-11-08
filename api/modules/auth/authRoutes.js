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
	app.put('/api/v1/auth/account', Ctrl.ensureAuthenticated, Ctrl.accountPut);
	app.delete('/account', Ctrl.ensureAuthenticated, Ctrl.accountDelete);
	app.post('/api/v1/auth/facebook', Ctrl.authFacebook);
	app.get('/api/v1/auth/facebook/callback', Ctrl.authFacebookCallback);
	app.post('/api/v1/auth/google', Ctrl.authGoogle);
	app.get('/api/v1/auth/google/callback', Ctrl.authGoogleCallback);
};
/////////////////////////////////////////////////////////////////////////////////////
// SWAGGER DEFINITIONS //////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

/**
  * @swagger
  *  tags:
  *  - name: auth
  *    description: Everything about login and signup
  *    externalDocs:
  *      description: Find out more
  *      url: http://swagger.io
  *  - name: movies
  *    description: All routes about movies
  *  - name: showtimes
  *    description: All routes about showtimes
  *  - name: theaters
  *    description: All routes about theaters
  *  - name: users
  *    description: Operations about users
  *  - name: favorites
  *    description: Operations about favorites
  *  - name: matches
  *    description: Operations about matches
  *  - name: swiper
  *    description: Operations about swiper
  *    externalDocs:
  *      description: Find out more about our store
  *      url: http://swagger.io
*/
