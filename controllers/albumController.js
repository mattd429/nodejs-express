var Album = require('../models/album');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
var Track = require('../models/track');

var async = require('async');

// add async to the index...
exports.index = function('async');

exports.index = function(req, res) {

  async.parallel({
      album_count: function(callback) {
           Album.count(callback);
      },
      track_count: function(callback) {
           Track.count(callback);
      },
      track_number_count: function(callback) {
           //Track.count({status}) - need to figure this out...How to display Track number count for albums.
      },
      artist_count: function(callback) {
           Artist.count(callback);
      },
      genre_count: function(callback) {
           Genre.count(callback);
      },
  },  function(err, results) {
        res.render('index', {title: 'Music Library Home', error: err, data: results});
  });
  
};

// Display list of all albums
exports.album_list = function(req, res, next) {
  // find title, artist && populate w/ artist
  Album.find({}, 'title artist')
    .populate('artist')
    .exec(function (err, list_albums) {
      if (err) {return next(err); }
      //Successful, so render...
      res.render('album_list', { title: 'Album List', album_list: list_albums });
  });
  
};

// Display detail page for a specific album
exports.album_detail = function(req, res) {
     res.send('NOT IMPLEMENTED: album detail: ' + req.params.id);
};

// Display album create form on GET
exports.album_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: album create GET');
};

// Handle album create on POST
exports.album_create_post = function(req, res) {
    res.send('NOT IMPLEMENTED: album create POST');
};

// Display album delete form on GET
exports.album_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: album delete GET');
};

// Handle album delete on POST
exports.album_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: album delete POST');
};

// Display album update form on GET
exports.album_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: album update GET');
};

// Handle album update on POST
exports.album_update_post = function(req, res) {
    res.send('NOT IMPLEMENTED: album update POST');
};
