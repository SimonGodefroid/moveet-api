/////////////////////////////////////////////////////////////////////////////////////
// MODULES //////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const helmet = require('helmet');
const errorHandler = require('errorhandler');
const dotenv = require('dotenv');
const flash = require('express-flash');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const mime = require('mime');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const swaggerJSDoc = require('swagger-jsdoc');
const chokidar = require('chokidar');
const config = require('./config/config');
require('dotenv').config();
const app = (module.exports = express());

/////////////////////////////////////////////////////////////////////////////////////
// SWAGGER //////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
const hostVar = process.env.NODE_ENV === 'production' ? 'moveet-api.herokuapp.com' : 'localhost:3001';
let swaggerDefinition = {
	info: {
		title: 'Moveet API',
		version: '1.0.0',
		description: 'Moveet API documentation'
	},
	host: hostVar,
	basePath: '/api'
};

let options = {
	swaggerDefinition: swaggerDefinition,
	apis: ['./api/modules/*/*Routes.js']
};
let swaggerSpec = swaggerJSDoc(options);

/////////////////////////////////////////////////////////////////////////////////////
// MONGOOSE /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on('error', () => {
	console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
	process.exit(1);
});

/////////////////////////////////////////////////////////////////////////////////////
// EXPRESS //////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('superSecret', config.secret);
app.use(express.static('public'));
app.use(logger('dev'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json({ limit: '15mb' }));
app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));
app.use(expressValidator());
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: process.env.SESSION_SECRET,
		store: new MongoStore({
			url: process.env.MONGODB_URI,
			autoReconnect: true,
			clear_interval: 3600
		})
	})
);
app.use(errorHandler());
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
	res.locals.user = req.user;
	next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/api', cors());

app.get('/', (req, res) => {
	res.send('API ready');
});

app.get('/swagger.json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});

/////////////////////////////////////////////////////////////////////////////////////
// ROUTES ///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// require('./api/modules/auth/authRoutes')(app);
require('./api/modules/users/userRoutes')(app);
require('./api/modules/movies/movieRoutes')(app);
require('./api/modules/auth/authRoutes')(app);

/////////////////////////////////////////////////////////////////////////////////////
// CHOKIDAR /////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
// const incomingData = require('./incomingData.js');
// const watcher = chokidar.watch('./incoming', {
// 	ignored: /(^|[\/\\])\../,
// 	persistent: true,
// 	ignoreInitial: true
// });

// const log = console.log.bind(console);
// // Add event listeners.
// watcher.on('add', path => {
// 	log(`File ${path} has been added`);
// 	incomingData.importData(path);
// });

/////////////////////////////////////////////////////////////////////////////////////
// EXPRESS ERROR HANDLING ///////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.all('*', (req, res) => {
	res.status(404).json({
		error: 'Not Found'
	});
});

/////////////////////////////////////////////////////////////////////////////////////
// EXPRESS START UP /////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
app.listen(app.get('port'), () => {
	console.log(
		'%s App is running at http://localhost:%d in %s mode',
		chalk.green('✓'),
		app.get('port'),
		app.get('env')
	);
	console.log('  Press CTRL-C to stop\n');
});
