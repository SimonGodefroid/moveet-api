module.exports = app => {
	const Ctrl = require('./userController')();
	const User = require('./userModel');
	const Movie = require('../movies/movieModel');
	const _ = require('lodash');
	require('dotenv').config();
	// const passportConfig = require('../../../config/passport');
	// app.use(passportConfig.tokenAuthApi);
	const cloudinary = require('cloudinary');

	// returns list of users
	app.route('/api/v1/users').get(Ctrl.list);
	/**
 * @swagger
  * /v1/users:
  *    get: 
  *     tags:
  *     - users
  *     summary: Lists all the users
  *     operationId: listUsers
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
  *         description: Fetched users
  *       400:
  *         description: Error
*/
	// returns user by id
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})').get(Ctrl.read);
	/**
 * @swagger
  * /v1/users/{id}:
  *    get: 
  *     tags:
  *     - users
  *     summary: Get a user by its id
  *     operationId: readUser
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
  *         description: Fetched user
  *       400:
  *         description: Error
*/
	// returns favorites for user with id
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/favorites').get(Ctrl.favoritesList);
	/**
 * @swagger
  * /v1/users/{id}/favorites:
  *    get: 
  *     tags:
  *     - users
  *     summary: Get the list of a user's favorites
  *     operationId: listFavorites
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
  *         description: Fetched favorite movies
  *       400:
  *         description: Error
*/
	// returns the users for which favorites matches the user's favorites
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/matches').get(Ctrl.matchesList);
	/**
 * @swagger
  * /v1/users/{id}/matches:
  *    get: 
  *     tags:
  *     - users
  *     summary: Get a list of users that have favorites in common with the specified user, the matching movies are also fetched
  *     operationId: listMatches
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
  *         description: Fetched matching users
  *       400:
  *         description: Error
*/
	// returns a list of buddies that want to see the same movie as the given user
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/findbuddy/:movieid([a-fA-F\\d]{24})').get(Ctrl.buddyFinder);
	/**
 * @swagger
  * /v1/users/{id}/findbuddy/{movieid}:
  *    get: 
  *     tags:
  *     - users
  *     summary: Get a list of users that have a given movie in their favorites
  *     operationId: findBuddy
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
  *     - in: path
  *       name: movieid
  *       required: true
  *       type: string
  *       format: '[a-fA-F\\d]{24}'
  *     responses:
  *       200:
  *         description: Fetched buddies
  *       400:
  *         description: Error
*/
	// adds/removes a movie to the list of favorites
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/favorites/:movieid([a-fA-F\\d]{24})').post(Ctrl.favoritesToggle);
	/**
 * @swagger
  * /v1/users/{id}/favorites/{movieid}:
  *    post: 
  *     tags:
  *     - users
  *     summary: Add/Remove a movie from the list of favorites
  *     operationId: toggleFavorite
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
  *     - in: path
  *       name: movieid
  *       required: true
  *       type: string
  *       format: '[a-fA-F\\d]{24}'
  *     responses:
  *       200:
  *         description: Updated user
  *       400:
  *         description: Error
*/
	// adds a movie to the list of swiper's likes
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/swipelike/:movieid([a-fA-F\\d]{24})').post(Ctrl.swipeLike);
	/**
 * @swagger
  * /v1/users/{id}/swipelike/{movieid}:
  *    post: 
  *     tags:
  *     - users
  *     summary: Add a movie from the list of swipe like
  *     operationId: swipeLike
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
  *     - in: path
  *       name: movieid
  *       required: true
  *       type: string
  *       format: '[a-fA-F\\d]{24}'
  *     responses:
  *       200:
  *         description: Updated user
  *       400:
  *         description: Error
*/

	// adds a movie to the list of swiper's pass
	app.route('/api/v1/users/:id([a-fA-F\\d]{24})/swipepass/:movieid([a-fA-F\\d]{24})').post(Ctrl.swipePass);
	/**
 * @swagger
  * /v1/users/{id}/swipepass/{movieid}:
  *    post: 
  *     tags:
  *     - users
  *     summary: Add a movie from the list of swipe pass
  *     operationId: swipePass
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
  *     - in: path
  *       name: movieid
  *       required: true
  *       type: string
  *       format: '[a-fA-F\\d]{24}'
  *     responses:
  *       200:
  *         description: Updated user
  *       400:
  *         description: Error
*/
};

/////////////////////////////////////////////////////////////////////////////////////
// SWAGGER DEFINITIONS //////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////

/**
 * @swagger
 * definitions:
  *  User:
  *    type: object
  *    properties:
  *      email:
  *        type: string
  *        example: 'simon@moveet.com'
  *        description: email of the user
  *      account:
  *        type: object
  *        properties:
  *          username:
  *            type: string
  *            example: 'Simon the watcher'
  *            description: username of the user
  *          favorites:
  *            type: array
  *            example: []
  *            description: array of user's favorite movies ids
  *          subscription:
  *            type: string
  *            example: 'UGC illimité'
  *            description: name of the subscription the user has
  *          age:
  *            type: integer
  *            example: 29
  *            description: age of the user
  *          gender:
  *            type: string
  *            example: 'Homme'
  *            description: gender of the user
  *          description:
  *            type: string
  *            example: 'Salut je suis un fan de films'
  *            description: bio of the user
  *          picture:
  *            type: string
  *            example: ''
  *            description: link to the picture of the user
  *          loc:
  *            type: object
  *            properties:
  *              type:
  *                type: string
  *                example: 'Point'
  *                description: type of location for mongoDB
  *              coordinates:
  *                type: array
  *                example: []
  *                description: array of user's coordinates
  *          buddies:
  *            type: array
  *            example: []
  *            description: array of ids of user's buddies
  *      messages:
  *        type: array
  *        items: 
  *          type: object
  *          properties:
  *            id_speaker:
  *              type: string
  *              example: ''
  *              description: id of the sender
  *            id_message:
  *              type: string
  *              example: ''
  *              description: id of the message
  *        example: []
  *        description: array of user's messages ids
  *      swipeLike:
  *        type: array
  *        example: []
  *        description: array of ids of movies that were swiped as liked
  *      swiperPass:
  *        type: array
  *        example: []
  *        description: array of ids of movies that were swiped as passed
*/
