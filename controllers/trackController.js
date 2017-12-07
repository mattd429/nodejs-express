// note '../' since we are not in the project root
var Track = require('../models/track');

// Display list of all Tracks
exports.tracks_list = function(req, res, next) {
    
    Track.find()
      .populate('album')
      .exec(function (err, list_track) {
        if (err) { return next(err); }
        // Successful, so render
        res.render('track_list', { title: 'Track', track_list: list_track });
    });
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

// Display Track update on GET
exports.track_update_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Track update GET');
};

// Handle Track update on POST
exports.track_update_post = function(req, res) {
   res.send('NOT IMPLEMENTED: Track update POST');
};

