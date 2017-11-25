var express = require('express');
var router = express.Router();

// Require our controllers
var album_controller = require('../controllers/albumController');
var artist_controller = require('../controllers/artistController');
var genre_controller = require('../controllers/genreController');
var track_controller = require('../controllers/trackController');

/// ALBUM ROUTES ///
