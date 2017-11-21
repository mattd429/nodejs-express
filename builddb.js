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
function albumCreate(title, artist, summary, barcode, genre, cb) {
  albumdetail = {
    title: title,
    artist: artist,
    summary: summary
  }
  if (barcode != false) albumdetail.barcode = barcode
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
function trackCreate(name, album, rating, track_number, cb) {
  trackdetail = {
    name: name,
    album: album
    rating: rating
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
// Print in order...
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
      function(callback) {
        genreCreate("electropop", callback);
      },
      function(callback) {
        genreCreate("hip hop", callback);
      },
      function(callback) {
        genreCreate("jazz", callback);
      },
      function(callback) {
        genreCreate("soul", callback);
      },   
    ],
    // optional callback
    cb);
}


function createAlbum(cb) {
    async.parallel([
        function(callback) {
          albumCreate('The Fame', artists[0], 'Is the debut studio album by American singer Lady Gaga. It was released on August 19, 2008, by Interscope Records. After joining Kon Live Distribution and Cherrytree Records in 2008, Gaga began working on the album with different producers, primarily RedOne, Martin Kierszenbaum and Rob Fusari. Musically, The Fame is an electropop, synth-pop, and dance-pop album that has displays from music from the 1980s',
          '602517664890', [genres[0],], callback);
        },
        function(callback) {
          albumCreate('Joanne', artists[0], 'is the fifth studio album by American singer Lady Gaga. It was released on October 21, 2016, by Streamline and Interscope Records. Gaga collaborated with several producers on the album, including Mark Ronson, Jeff Bhasker, BloodPop and RedOne, and co-produced the majority of the material. The music of Joanne features "stripped-down" soft rock and dance-pop styles in order to emphasize the singer\'s vocal abilities'
          '602557186437', [genres[0],], callback);
        },
        function(callback) {
          albumCreate('The Life od Pablo', artists[1], 'is the seventh solo studio album by American rapper Kanye West (eighth overall). It was released on February 14, 2016, by GOOD Music and Def Jam Recordings. Recording sessions took place from 2013 to 2016, in Italy, Mexico, Canada and the United States.'
          false, [genres[1],], callback)
        },
        function(callback) {
          albumCreate('Giant Steps', artists[2], 'is the fifth studio album by jazz musician John Coltrane as leader, released in 1960 on Atlantic Records, catalogue SD 1311. His first album for his new label Atlantic, it is the breakthrough album for Coltrane as a leader, and many of its tracks have become practice templates for jazz saxophonists. In 2004, it was one of fifty recordings chosen that year by the Library of Congress to be added to the National Recording Registry.'
          '075678133725', [genres[2],], callback);
        },
        function(callback) {
          albumCreate('Darkness and Light', artists[3], 'is the fifth studio album by American singer John Legend. The album was released on December 2, 2016 by GOOD Music and Columbia Records. It was produced by Blake Mills and features guest appearances from Chance the Rapper, Brittany Howard, and Miguel. The album is supported by two singles "Love Me Now", and "Penthouse Floor" featuring Chance the Rapper.'
          '889853795321', [genres[3],], callback);
        },
        ]
        // optional callback               
        cb);
}


function createTrack(cb) {
    async.parallel([
        function(callback) {
          trackCreate('Just Dance', albums[0], 4, 1, callback)
        },
        function(callback) {
          trackCreate('Million Reasons', album[1], false, 7, callback)
        },
        function(callback) {
          trackCreate('Famous', album[2], 3, 4, callback)
        },
        function(callback) {
          trackCreate('Father Stretch My Hands, Pt. 1', album[2], 3, 2, callback)
        },
        
    ])
}
