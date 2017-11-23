var Artist = require('../models/artist');

// Display list of all Artists
exports.artist_list = function(req, res) {
    res.send('NOT IMPLEMENTED: Artist list');
};

// Display detail page for a specific Artist
exports.artist_detail = function(req, res) {
    res.send('NOT IMPLEMENTED: Artist detail ' +  req.params.id);
};

// Display Artist create form on GET
exports.artist_detail_get = function(req, res) {
    res.send('NOT IMPLEMENTED: Artist detail GET');
};

// Handle Artist create on POST
exports.artist_detail_post = function(req, res) {

};
