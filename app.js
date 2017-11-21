// import some useful node libraries using require()
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// adding routes
var index = require('./routes/index');
var index = require('./routes/users');

// import express 
var app = express();

// Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'insert_your_database_url_here';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'MongoDB connection error:'));

// views(template) engine setup
app.set('views', path.join(__dirname, 'views'));
// set the views engine to 'pug'
app.set('views engine', 'pug')

// add the middleware libraries 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //log
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use.(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// define our routes
app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	//set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	
	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

// allow app to be import to /bin/www
module.exports = app;

