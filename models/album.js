var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var AlbumSchema = new Schema({
  title: {type: String, required: true},
  artist: {type: Schema.ObjectId, ref: 'Artist', required: true},
  summary: {type: String, required: true},
  isni: {type: Number, required: true, max: 16},
  genre: [{type: Schema.ObjectId, ref: 'Genre'}] //Not created yet
});

// Virtual for album's URL
AlbumSchema
.virtual('url')
.get(function () {
  return '/popular/album/' + this._id;
});

//Export
module.exports = mongoose.model('Album', AlbumSchema);
