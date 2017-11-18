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
var Album = require('./models/book')
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
