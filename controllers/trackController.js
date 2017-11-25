// note '../' since we are not in the project root
var Track = require('../models/track');

// Display list of all Tracks
exports.tracks_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Track list');
};

// Display detail page for a specific Track
exports.track_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Track detail: ' + req.params.id);
};


