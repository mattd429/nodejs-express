// note '../' since we are not in the project root
var Track = require('../models/track');

// Display list of all Tracks
exports.tracks_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Track list');
};

// Display track detail page for a specific Track
exports.track_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Track detail: ' + req.params.id);
};

// Display track create form on GET
exports.track_create_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Track create GET');
};

// Handle Track create on POST
exports.track_create_post = function(req, res) {
    res.send('NOT IMPLMENTED: Track create POST');
};

// Display Track delete form on GET
exports.track_delete_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Track delete GET');  
};

// Handle Track delete on POST
exports.track_delete_post = function(req, res) {
    res.send('NOT IMPLEMENTED: Track delete POST');
};


