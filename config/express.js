'use strict';


const session = require('express-session');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
// const upload = require('multer')();
const serveStatic = require('serve-static')
const mongoose = require('mongoose');
const moment = require('moment');


const mongoStore = require('connect-mongo')(session)
const flash = require('connect-flash');
const config = require('./');
const pkg = require('../package.json');

const env = process.env.NODE_ENV || 'development';

module.exports = function (app, passport) {
	// Static files middleware
	app.use(serveStatic(config.root + '/public'));

	// set views path, template engine and default layout
	app.set('views', config.root + '/app/views');
	app.set('view engine', 'jade');

	// expose package.json to views
	app.use(function (req, res, next) {
		res.locals.pkg = pkg;
		res.locals.env = env;
		next();
	});

	// bodyParser should be above methodOverride
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	// app.use(upload.single('image'));
	
	// CookieParser should be above session
	app.use(cookieParser());
	app.use(cookieSession({ secret: 'secret' }));
	app.use(session({
		resave: false,
		saveUninitialized: true,
		secret: pkg.name,
		store: new mongoStore({
		  url: config.db,
		  collection : 'sessions'
		})
	}));

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages - should be declared after sessions
 	app.use(flash());
 	// set flash
	app.use(function (req, res, next) {
		res.locals.errors = req.flash('error');
		res.locals.infos = req.flash('info');
		res.locals.success = req.flash('success');
		next();
	});

 	app.locals.moment = moment;

	if (env === 'development') {
	    app.locals.pretty = true;
	    mongoose.set('debug', true)
	}

}