var express = require('express');
var router = express.Router();

// Require our controllers
var album_controller = require('../controllers/albumController');
var artist_controller = require('../controllers/artistController');
var genre_controller = require('../controllers/genreController');
var track_controller = require('../controllers/trackController');

/// ALBUM ROUTES ///

/* GET inventory home page. */
router.get('/', album_controller.index);

/* GET request for creating a Album. NOTE This must come before routes that display album (uses id) */
router.get('/album/create', album_controller.album_create_get);

/* POST request for creating album. */
router.post('/album/create', album_controller.album_create_post);

/* GET request to delete Album. */
router.get('/album/delete', album_controller.album_delete_post);

