module.exports = app => {
	const Ctrl = require('./theaterController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	app.route('/api/v1/theaters').get(Ctrl.list);
	/**
 * @swagger
  * /v1/theaters:
  *    get: 
  *     tags:
  *     - theaters
  *     summary: Get the list of all theaters
  *     operationId: listTheaters
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: header
  *       name: x-access-token
  *       required: false
  *       type: string
  *     responses:
  *       200:
  *         description: Fetched theaters
  *       400:
  *         description: Error
*/
	app.route('/api/v1/theaters/:id([a-fA-F\\d]{24})').get(Ctrl.read);
	/**
 * @swagger
  * /v1/theaters/{id}:
  *    get: 
  *     tags:
  *     - theaters
  *     summary: Get a theater by its id
  *     operationId: readTheater
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: header
  *       name: x-access-token
  *       required: false
  *       type: string
  *     - in: path
  *       name: id
  *       required: true
  *       type: string
  *       format: '[a-fA-F\\d]{24}'
  *     responses:
  *       200:
  *         description: Fetched theater
  *       400:
  *         description: Error
*/
	app.route('/api/v1/theaters/find').get(Ctrl.find);
};
