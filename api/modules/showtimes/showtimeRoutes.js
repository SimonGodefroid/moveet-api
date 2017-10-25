module.exports = app => {
	const Ctrl = require('./showtimeController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	app.route('/api/v1/showtimes').get(Ctrl.list);

	/**
 * @swagger
  * /v1/showtimes:
  *    get: 
  *     tags:
  *     - showtimes
  *     summary: Get the showtimes for a movie
  *     operationId: listShowtimes
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: header
  *       name: x-access-token
  *       required: false
  *       type: string
  *     - in: query
  *       name: movie
  *       required: true
  *       type: number
  *       description: id of the movie from source DB (code)
  *     - in: query
  *       name: count
  *       required: false
  *       type: integer
  *       description: limit for the results
  *     - in: query
  *       name: zip
  *       required: false
  *       type: number
  *       description: zipcode for the search
  *     - in: query
  *       name: lat
  *       required: false
  *       type: number
  *       description: latitude of the user
  *     - in: query
  *       name: long
  *       required: false
  *       type: number
  *       description: longitude of the user
  *     - in: query
  *       name: radius
  *       required: false
  *       type: number
  *       description: radius limit for the search expressed in kilometers.
  *     - in: query
  *       name: theaters
	*       required: false
	*       type: array
  *       items:
	*         type: integer
	*       description: list of theater codes for the search
  *     responses:
  *       200:
  *         description: Fetched showtimes
  *       400:
  *         description: Error
*/
};
