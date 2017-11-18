// import mongoose
var mongoose = required('mongoose');

// create Schema
var Schema = mongoose.Schema;

// define Schema
var ArtistSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    last_name: {type: String, required: true, max: 100},
    stage_name: {type: String, max: 100},
    date_of_birth: {type: Date},
    date_of_birth: {type: Date},
  }
);

// Virtual for artist's full name
ArtistSchema
.virtual('name')
.get(function () {
  return this.last_name + ', ' + this.first_name;
});

// Virtual for artist's url
ArtistSchema
.virtual('url')
.get(function () {
  return '/popular/artist/' + this._id;
});

//export model
module.exports = mongoose.model('Artist', ArtistSchema);


