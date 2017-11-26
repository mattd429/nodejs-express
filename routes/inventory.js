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
router.get('/album/:id/delete', album_controller.album_delete_get);

/* POST request to delete Album. */
router.post('/album/:id/delete', album_controller.album_delete_post);

/* GET request to update Album. */
router.get('/album/:id/update', album_controller.album_update_get);

/* POST request to update Album. */
router.post('/album/:id/update', album_controller.album_update_post);

/* GET request for one Album. */
router.get('/album/:id', album_controller.album_detail);

/* GET request for list of all Albums. */
router.get('/albums', album_contoller.album_list);

/// ARTIST ROUTES ///

/* GET request for creating Artist. NOTE this must come before route for id (ie display artist) */
router.get('/artist/create', artist_controller.artist_create_get);

/* POST request for creating Artist. */
router.post('/artist/create', artist_controller.artist_create_post);

/* GET request for deleting Artist. */
router.get('/artist/delete', artist_controller.artist_delete_get);

