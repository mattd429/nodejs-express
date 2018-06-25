### populatedb.js

Lets break down the `populatedb.js` 

```javascript
#! /usr/bin/env node

console.log(This script populates a some test books, authors, genres and bookistances to your database. Specified as argument - e.g.: populatedb mongodb://your_username: your_password@your_database_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specif a valid mongodb URL as the first argument');
    return
}
```

here we have our console.log which will display a string to tell you what this script will do.

```javascript 
var userArgs = process.argv.slice(2);
```
- will process an array of arguments, the reason we slice at the start of array [2] is because the first arg will be 'node', then the path to our script, they will always be present even if your program takes no arguments of it own.

```javascript
if (!userArgs[0].startsWith('mongodb://'))  {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
```

- if not user arguments start from the beginning of the string that starts with 'mongodb://' then the program will return an error message. 

Next we are going to import async, Book, Author, Genre, BookInstance, and Genre.
We use the require to state that we will be imported this models and async.

- we use `async` since we want to be able to send data to the dB while continuing to execute other code that comes after that. hence the name `async`.

```javascript
//import models && async
var async = require('async')
var Book = require('./models/book')
var Author = require('./models/author')
var Genre = require('./models/genre')
var BookInstance('./models/bookinstance')
```

Next we will connect of database and import Mongoose(our DB).
1. first import Mongoose.
2. set MongoDB to equal our userArgs[0] from before, which states make sure out arguments starts with 'mongodb://' if not send an error!
3. we want to use `mongoose.connect(mongoDB);` to connect to our db that we will specifiy using our userArgs which will display the path to our cloud hosted db. 
4. `var db = mongoose.connection;` to get our default connection.
5. set up an error on `mongoose.connection.on()` if we have any errors conenction to the default connection.

```javascript
var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.log.bind(console, 'MongoDB connection error:'));
```
Lets create our `arrays` next

```javascript
var authors = []
var genres = []
var books = []
var bookinstances = []
```

create a function to create the author.

```javascript
function authorCreate(first_name, family_name, d_birth, d_death, cb) {
  authordetail = {first_name:first_name , family_name: family_name }
  if (d_birth != false) authordetail.date_of_birth = d_birth
  if (d_death != false) authordetail.date_of_death = d_death
```
create the information for the author and we want to build this into our db, now we need to set the detials by creating a [object literal](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals) to define the first_name & family_name.

after that we want to setup an `if` statement for d_birth & d_death since we may not need to build data for that.  by stating that if the dob and the dod is not false(null) then state that date_of_birth && date_of_death from our models we define to equal our shorten_name d_birth && d_death.

next we want to create the variable with the new detailed information for the author.

```javascript
var author = new Author(authordetail);
```

save the data to the db using the `author.save()` function.

```javascript
author.save(function (err) {
  if (err) {
  cb(err, null)
  return
  }
})
```

we want to save the data but if we recieve an error display the message with a error, we have not defined that error yet for later in our script we will define that error. remember our cb(callback) this will callback our error if need be.

```javascript
console.log('New Author: ' + author);
authors.push(author)
cb(null, author)
} );
}
```
if all goes smooth then we want to print our the string new Author: will the information we just created to be saved to the mongoDB.  use our callback, and use push to push the data.
