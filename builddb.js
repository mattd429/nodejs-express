#! /usr/bin/env node

console.log('This script populates artist, album, track, and genre models')

// Get arguments passed on command line
var uArgs = process.argv.slice(2);
if (!uArgs[0].startsWith('mongoDB://')) {
    console.log('Error: You need to specify a valid mongodb URL as your first argument');
    return
}
//import models && async
var async = require('async')
var Album = require('./models/album')
var Artist = require('./models/artist')
var Genre = require('./models/genre')
var Track = require('./models/track')

//connect db && import mongoose
var mongoose = require('mongoose');
var mongoDB = uArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bing(console, 'MongoDB connection error:'));

// arrays
var artists = []
var genres = []
var albums = []
var tracks = []

// create artist || error
function artistCreate(first_name, last_name, s_name, d_birth, d_death, cb) {
  artistdetail = {first_name:first_name, last_name: last_name }
  if (s_name != false) artistdetail.stage_name = s_name
  if (d_birth != false) artistdetail.date_of_birth = d_birth
  if (d_death != false) artistdetail.date_of_death = d_death
    
  var artist = new Artist(artistdetail);
    
  artist.save(function (err) {
    if (err) {
       cb(err, null)
       return
    }
    console.log('New Artist: ' + artist);
    artists.push(artist)
    cb(null, artist)
  }   );
}
// Create genre || error
function genreCreate(name, cb) {
  var genre = new Genre({ name: name });

  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

// Create album || error
function albumCreate(title, artist, summary, isni, genre, cb) {
  albumdetail = {
    title: title,
    artist: artist,
    summary: summary,
    isni: isni
  }
  if (genre != false) albumdetail.genre = genre
    
  var album = new Album(albumdetail);
  album.save(function (err) {
    if (err) {
        cb(err, null)
        return
    }
    console.log('New Album: ' + album);
    albums.push(album)
    cb(null, album)
  }   );
}
// Create Track || err
function trackCreate(name, album, track_number, cb) {
  trackdetail = {
    name: name,
    album: album
  }
  if (track_number != false) trackdetail.track_number = track_number
    
  var track = new Track(trackdetail);
  track.save(function (err) {
    if (err) {
      console.log('ERROR CREATING track:' + track);
      cb(err, null)
      return
    }
    console.log('New Track:' + track);
    tracks.push(track)
    cb(null, track)
  }   );
}
// want to print in order...
function createGenreArtists(cb) {
  async.parallel([
      function(callback) {
        artistCreate('Lady', 'Gaga', '1986-03-28', false, callback);
      },
      function(callback) {
        artistCreate('Kanye', 'West', '1977-06-08', false, callback);
      },
      function(callback) {
        artistCreate('John', 'Coltrane', '1926-09-23', '1967-07-17', callback);
      },
      function(callback) {
        artistCreate('John', 'Legend', '1978-12-28', false, callback);
      },
      
  ])
}
