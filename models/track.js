var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TrackSchema = new Schema({
  name: = { type: String, required: true},
  album: {type: Schema.ObjectId, ref: 'Album', required: true},
  track_number: {type: Number, max: 3},
});

// virtual for track's url
TrackSchema
.virtual('url')
.get(function () {
  return '/popular/track' + this._id;
});

//export
module.exports = mongoose.model('Track', TrackSchema);
