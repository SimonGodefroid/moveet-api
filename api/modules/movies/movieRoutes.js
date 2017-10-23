module.exports = app => {
	const Ctrl = require('./movieController')();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	app.route('/api/v1/movies').get(Ctrl.list);
	/**
 * @swagger
  * /v1/movies:
  *    get: 
  *     tags:
  *     - movies
  *     summary: Lists all the movies
  *     operationId: listMovies
  *     produces:
  *     - application/json
  *     parameters:
  *     - in: header
  *       name: x-access-token
  *       required: false
  *       type: string
  *     - in: query
  *       name: limit
  *       required: false
  *       type: integer
  *     - in: query
  *       name: page
  *       required: false
  *       type: integer
  *     responses:
  *       200:
  *         description: Fetched movies
  *       400:
  *         description: Error
*/
	app.route('/api/v1/movies/:id([a-fA-F\\d]{24})').get(Ctrl.read);
	/**
 * @swagger
  * /v1/movies/{id}:
  *    get: 
  *     tags:
  *     - movies
  *     summary: Get a movie by its id
  *     operationId: readMovie
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
  *         description: Fetched movie
  *       400:
  *         description: Error
*/
};

// 					media: { $ne: 'nothing here' }
// 			.sort({ 'statistics.theaterCount': 'descending' })
// 			.sort({ 'release.releaseDate': 'ascending' })

/**
 * @swagger
 * definitions:
  *  Movie:
  *    type: object
  *    properties:
  *          code:
  *            type: integer
  *            format: int64
  *            example: 123
  *            description: movie id in source API
  *          movieType:
  *            type: object
  *            properties:
  *              code:
  *                type: integer
  *                example: ''
  *                description: code for movie type
  *              value:
  *                type: string
  *                example: ''
  *                description: value of the code for movie type
  *          originalTitle:
  *            type: string
  *            example: 'Old Boy'
  *            description: original title of the movie in source API
  *          title:
  *            type: string
  *            example: ''
  *            description: title of the movie in source API
  *          productionYear:
  *            type: integer
  *            example: 2018
  *            description: production year of the movie
  *          synopsis:
  *            type: string
  *            example: ''
  *            description: synopsis of the movie
  *          nationality:
  *            type: array
  *            example: ''
  *            description: country codes for nationality
  *          genreList:
  *            type: array
  *            example: []
  *            description: list of genre codes for the movie in source API
  *          genreListSimon:
  *            type: array
  *            example: []
  *            description: list of genre codes by Simon
  *          media:
  *            type: string
  *            example: 'Affiche'
  *            description: type of media asset
  *          posterPath:
  *            type: string
  *            example: ''
  *            description: url of the movie poster
  *          statusList:
  *            type: string
  *            example: 'comingsoon'
  *            description: name of the movie list from source API
  *          release:
  *            type: object
  *            properties:
  *              releaseDate:
  *                type: date
  *                example: ''
  *                description: release date of the movie
  *              releaseState:
  *                type: object
  *                properties:
  *                  value:
  *                    type: string
  *                    example: 'Sortie en salle'
  *                    description: release status of the movie
  *                  code:
  *                    type: integer
  *                    example: 3004
  *                    description: code for the release status
  *              country:
  *                type: object
  *                properties:
  *                  code:
  *                    type: integer
  *                    example: '5001'
  *                    description: code for the country in source API
  *              distributor:
  *                type: object
  *                properties:
  *                  code:
  *                    type: integer
  *                    example: 12588
  *                    description: code of the distributor
  *                  name:
  *                    type: string
  *                    example: 'Wild Bunch Distribution'
  *                    description: name of the distributor
  *          runtime:
  *            type: integer
  *            example: 7380
  *            description: runtime of the movie in seconds
  *          color:
  *            type: object
  *            properties:
  *              value:
  *                type: string
  *                example: ''
  *                description: flags the movie as color or black and white
  *          language:
  *            type: object
  *            properties:
  *              value:
  *                type: string
  *                example: ''
  *                description: language of the movie
  *          castingShort:
  *            type: object
  *            example: ''
  *            description: contains the casting for the movies, actors and director(s)
  *          trailerEmbed:
  *            type: object
  *            example: ''
  *            description: embed link to the trailer of the movie
  *          hasShowtime:
  *            type: integer
  *            example: ''
  *            description: specifies whether the movie is playing
  *          hasPreview:
  *            type: integer
  *            example: ''
  *            description: specifies whether the movie has a preview
  *          statistics:
  *            type: object
  *            example: ''
  *            description: contains the movies statistics on source platform
*/
