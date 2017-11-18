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
mongoose.connection.on('error', console.log.bing(console, 'MongoDB connection error:'));

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
            cd(err, null)
            return
        }
        console.log('New Artist: ' + artist);
        artists.push(artist)
        cb(null, artist)
    }   );
}
function genreCreate(name, album, genre, cb) {
    genredetail = {
      name: name,
      genre: genre
    }
    if (album != false) genredetail.album = album
    
    var genre = new Genre(genredetail);
    
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
    }     );
}
