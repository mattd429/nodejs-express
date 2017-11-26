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
router.get('/artist/:id/delete', artist_controller.artist_delete_get);

/* POST request for deleting Artist. */
router.post('/artist/:id/delete', artist_controller.artist_delete_post);

/* GET request for updating Artist. */
router.get('/artist/:id/update', artist_controller.artist_update_get);

/* POST request for updating Artist. */
router.post('/artist/:id/update', artist_controller.artist_update_post);

/* GET request for one Artist. */
router.get('/artist/:id', artist_controller.artist_detail);

/* GET requqets for list of all Artists. */
router.get('/artists', artist_controller.artist_list);

/// GENRE ROUTES ///

/* GET request for creating a Genre. NOTE This must come before routes that displays GENRE (uses ID) */
router.get('/genre/create', genre_controller.genre_create_get);

/* POST request for creating Genre.*/
router.post('/genre/create', genre_controller.genre_create_post);

/* GET request for deleting Genre. */
router.get('/genre/:id/delete', genre_controller.genre_delete_get);

/* POST request for deleting Genre. */
router.post('/genre/:id/delete', genre_controller.genre_delete_post);

/* GET request for updaing Genre. */
router.get('/genre/:id/update', genre_controller.genre_update_get);

/* POST request for updaing Genre. */
router.post('/genre/:id/update', genre_controller.genre_update_post);

/* GET request for one Genre. */
router.get('/genre/:id', genre_controller.genre_detail);

/* GET request for list of Genres. */
router.get('/genres', genre_controller.genre_list);

/// TRACK ROUTES ///

/* GET request for creating Track. Note this must come before routes that display Track (uses ID). */
router.get('/track/create', track_controller.track_create_get);

/* POST request for creating Track. */
router.post('/track/create', track_controller.track_create_post);

/* GET request for deleting Track. */
router.get('/track/:id/delete', track_controller.track_delete_get);

/* POST request for deleting Track. */
router.post('/track/:id/delete', track_controller.track_delete_post);

/* GET request for updating Track. */
router.get('/track/:id/update', track_controller.track_update_get);

