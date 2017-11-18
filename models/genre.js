var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var GenreSchema = new Schema({
  name: {type: String, required: true, min: 3, max: 100},
  album: {type: Schema.ObjectId, ref: 'Album'},
  genre: {type: String, required: true, enum ['electropop', 'hip-hop', 'rock', 'pop', 'dream-pop', 'alternative']},
});

// virtual for genre
GenreSchema
.virtual('url')
.get(function () {
  return '/popular/genre/' + this._id;
});

//Export
module.exports = mongoose.model('Genre', GenreSchema);
