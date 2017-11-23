var Album = require('../models/album');

exports.index = function(req, res) {
    res.send('NOT IMPLEMENTED: Site Home Page');
};

// Display list of all albums
exports.album_list = function(req, res) {
    res.send('NOT IMPLEMENTED: album list');
};

// Display detail page for a specific book
exports.book_detail = function(req, res) {
     res.send('NOT IMPLEMENTED: album detail: ' + req.params.id);
};

// Display album create form on GET
exports.
