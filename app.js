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

// views(template) engine setup
app.get('views', path.join(__dirname, 'views'));
// set the views engine to 'pug'
app.set('views engine', 'pug')

// add the middleware libraries 
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
	//set locals, only providing error in developmen
})

