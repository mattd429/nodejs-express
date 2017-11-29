var Album = require('../models/album');
var Artist = require('../models/artist');
var Genre = require('../models/genre');
var Track = require('../models/track');

var async = require('async')

// Display list of all albums
exports.album_list = function(req, res) {
    res.send('NOT IMPLEMENTED: album list');
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
