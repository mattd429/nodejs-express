## MongoDB

#### Best way to interact with a database
There are two approaches for interacting with database:

  - Using the databases' native query lanaguage (e.g. SQL)
  - Using an Object Data Model("ODM")/Object Relational Model("ORM").  An ORDM/ORM represents the website's data as javascript objects, which are then mapped to the underlying database.  Some ORMs are tied to a specific database, while others provide a databse-agnostic backend

Best *performance* can be gained using SQL, ODM is often slower because they translate code to map between objects and db formats.

The benefits of ORM is that the programmer can continue to think in terms of writing in JS objects rather then db semantics.

### ORM/ODM

Check our [odm](https://www.npmjs.com/browse/keyword/odm) and [orm](https://www.npmjs.com/browse/keyword/orm) available for NPM package manager.

- [Mongoose](https://www.npmjs.com/package/mongoose): Mongoose is a [MongoDB](https://www.mongodb.com/) object modeling tool designed to work in an **asynchronous** enviroment.
- [Waterline](https://www.npmjs.com/package/waterline): An ORM extracted from the Express-based Sails web framework. It provides a uniform API for accessing numerous different databases, including Redis, mySQL, LDAP, MongoDB, and Postgres.
- [Bookshelf](https://www.npmjs.com/package/bookshelf): Features both promise-based and traditional callback interfaces, providing transaction support, eager/nested-eager relation loading, polymorphic associations, and support for one-to-one, one-to-many, and many-to-many relations. Works with PostgreSQL, MySQL, and SQLite3.
- [Objection](https://www.npmjs.com/package/objection): Makes it as easy as possible to use the full power of SQL and the underlying database engine (supports SQLite3, Postgres, and MySQL).
- [Sequelize](https://www.npmjs.com/package/sequelize) is a promise-based ORM for Node.js and io.js. It supports the dialects PostgreSQL, MySQL, MariaDB, SQLite and MSSQL and features solid transaction support, relations, read replication and more.


### Install Mongoose and MongoDB

Mongoose is installed in your project (**package.json**) like any other dependency -- using NPM.  To install it, use the following command inside your project folder:

```
npm install mongoose
```

Installing *Mongoose* adds all its dependencies, including the MongoDB databse driver, but it does not install MongoDB itself.  

**Note**: for this project we will use a cloud-base [sandbox tier](https://mlab.com/plans/pricing/)

### connecting to MongoDB

*Mongoose* requires a connection to a MongoDB database.  You can `require()` and connect to a locally hosted database with `mongoose.connect()`, as shown below.

```javascript
//Import the mongoosse module
var mongoose = require('mongoose');

//Set up  default mongoose connection
var mongoDB = 'mongo://127.0.0.1/my_database';
mongoose.connect(mongoDB, {
  useMongeClient: true
});

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.log.bind(console, 'MongoDB connection error:'));

```

You can get the default `Connection` object with `mongoose.connection`. Once connected, the open event is fired on the `Connection` instance.

If you need to create addtional connections you can use `mongoose.createConnection()`. This takes the same form of databae URI (with host, database, port, options etc.) as `connect()` and returns a `Connection` object.

### Defining and creating models

Models are *defined* using the `Schema` interface.  The Schema allows you to define the fields stored in each document along with their validation requirements and default values.

Schemas are then "complied" into models using the `mongoose.model()` method.  Once you have a model you can use it to find, create, update, and delete objects of the given type.

### Defining schemas

The code fragement below shows how you might define a simple schema.  First you `require()` mongoose, then use the Schema constructor to create a new schema instane, defining the various fields inside it in the constructor's object parameter.

```javascript
//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date
});
```
we just have two fields, a string and a date.

### Creating Model

Models are created from schemas using the `mongoose.model()` method:

```javascript
// Define schema
var Schema = mongoose.Schema;

var SomeModelSchema = new Schema({
  a_string: String,
  a_date: Date
});

// Compile model from schema
var SomeModel = mongoose.model('SomeModel', SomeModelSchema);
```

- First argument Mongoose will create the databse collection for the above model SomeModel.

- Second fargument is the schema you want to use in creating the model.


### Schema types(fields)

A schema can have an arbitrary number of fields — each one represents a field in the documents stored in *MongoDB*. An example schema showing many of the common field types and how they are declared is shown below.

```javascript
var schema = new Schema( 
{
  name: String,
  binary: Buffer,
  living: Boolean,
  updated: { type: Date, default: Date.now },
  age: { type: Number, min: 18, max: 65, required: true },
  mixed: Schema.Types.Mixed,
  _someId: Schema.Types.ObjectId,
  array: [],
  ofString: [String], // You can also have an array of each of the other types too.
  nest: { stuff: { type: String, lowercase: true, trim: true } }
})
```

Most of the [SchemaTypes](http://mongoosejs.com/docs/schematypes.html) are self explained some exceptions:

  - `ObjectId`: Represents specific instances of a model in the database.  For example, a album might use this to represent its artist object.  This will actually contain the unquite ID (__id_) for the specified object.  We can use the populat() method to pull in the associated information when needed.
  - [Mixed](http://mongoosejs.com/docs/schematypes.html#mixed) an "anything goes" SchemaType.
  - [  ]: An Array of items. You can preform JavaScript opertations on these models(push, pop, unshift, etc.). The examples above show an array of objects without a specified type and an array of `String` objects, but you can have an array of any type of object.

The code also hows both ways of declaring a field:

- Field *name* and *type* as a key-value pair(i.e. as done with fields `name`,`binary` and `living`).
- Filed *name* followed by an object defining the `type`, and nay other *options* for the field. Options inlcude things like:
- - default values.
- - build-in validators(e.g. max/min values) and custom validation functions.
- - Whether the field is required
- - Whether `String` fields should automatically be set to lowercase, uppercasem or trimmed(e.g. `{ type: String, lowercase: true, trim: true }`)

### Validation

Mongoose provides built-in and custom validators, and synchronous and asynchronous validators.  It allows you to specify both the acceptable range or values and the error message for validation failure in all cases.

The built-in validators include:

- All SchemaTypes have the built-in [required](http://mongoosejs.com/docs/api.html#schematype_SchemaType-required) validator.  This is used to specify whether the field must be supplied in order to save a document.
- [Numbers](http://mongoosejs.com/docs/api.html#schema-number-js) have [min](http://mongoosejs.com/docs/api.html#schema_number_SchemaNumber-min) and [max](http://mongoosejs.com/docs/api.html#schema_number_SchemaNumber-max) validators.
- [String](http://mongoosejs.com/docs/api.html#schema-string-js) have:
- - [enum](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-enum): specifies the set of allowed values for the field.
- - [match](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-match): specifies a regular expression that the string must match
- - [maxlength](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-maxlength) and [minlength](http://mongoosejs.com/docs/api.html#schema_string_SchemaString-minlength) for the string.

Below example specify some of the validator types and error messages:



    var breakfastSchema = new Schema({
      eggs: {
        type: Number,
        min: [6, 'Too few eggs'],
        max: 12
        required: [true, 'Why no eggs?']
      },
      drink: {
        type: String,
        enum: ['Coffee', 'Tea', 'Water',]
      }
    });
    
### Install Mongoose

Open a command prompt and navigate to the directory where you created you [skeleton Local Library Website](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website).  Enter the following command to install Mongoose (and its dependencies) and add it to your **package.json** file, unless you have already done so when reading the [Mongoose Primer](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Installing_Mongoose_and_MongoDB) above.

```
npm install mongoose --save
```

### Connect to MongoDB

Open **/app.js** (in the root of your project) and code the following text below where you declare the *Express application object* (after the line `var app = express();`). Replace the database url string ('insert_your_database_url_here') with the location of your own database(i.e. using the information [from mLab](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Setting_up_the_MongoDB_database)).

```javascript
//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'insert_your_database_url_here';
mongoose.connect(mongoDB, {
  useMongoClient: true
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
```
As discussed in the [Mongoose primer above](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#Connecting_to_MongoDB), this code creates the default connection to the database and binds to the error event (so that errors will be printed to the console).

### Defininf the LocalLibrary Schema

We will define a sperate module for each model, as [discussed above](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#One_schemamodel_per_file). Start by creating a folder for our models in the project (**/models**) and then create seperate files for each of the models.

```
/express-locallibrary-tutorial // the project root
  /models
    author.js
    book.js
    bookinstance.js
    genre.js
```

### Author model

write the `Author` schema code showne below into your ./models/author.js file.  The schema define an author has having `String` SchemaTypes for the first and family names, that are required and have a maximum of 100 characters, and `Date` fiels for the date of birth and death.

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AuthorSchema = new Schema(
  { 
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.family_name + ', ' + this.first_name;
});

// Virtual for author's URL
AuthorSchema
.virutal('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
```

We've also declared a [virtual](http://mongoosejs.com/docs/guide.html#virtuals) for the AuthorSchema names "url" that returns the absolute URL required to get a particular instance of the model -- we will use the property in our tempaltes whenever we need to get a link to a particular author.

**NOTE**: making a URLs a virtual in the schema is good idea because we only have to change it in one place.

At the end of the module we export the model.

### Book Model

Write the `Book` schema code below into your **./models/book.js** file.  Most of this is similiar to the author model -- we have declared a schema witha  number of string fileds and a virtual for getting the URL of a specific book records, and we've exported the model.

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new Schema({
  title: {type: String, required: true},
  author: {type: Schema.ObjectId, ref: 'Author', required: true},
  summary: {type: String, required: true},
  isbn: {type: String, required: true},
  genre: [{type: Schema.ObjectId, ref: 'Genre'}] // since we have not created this yet...
});

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return 'catalog/book/' + this._id;
});

//Export model
module.exports = mongoose.model('Book', BookSchema);
```

The main difference here is that we've created two reference to other models:

- author is a reference to a single `Author` model object, and is required.
- genre is a reference to an array `Genre` model objects. We have not declared this object yet!

### BookInstance model

finally, write the `BookInstance` schema code showen below into your **./models/bookinstance.js** file.  The `BookInstance` represenets a specific copy of a book that somone might borrow, and includes iformation about the copy is available or on what date it is expected back, "imprint" or version details.

```javascript
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookInstanceSchema = new Schema({
  book : { type: Schema.ObjectID, ref: 'Book', required: true }, //reference to the associated book
  imprint: {type: String, required: true},
  status: {type: String, required: true, enum ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
  due_back: {type: Date, default: Date.now},
});

// Virutal for bookinstance;s URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return '/catalog/bookinstance/' + this._id;
});

//Export model
module.exports = mongoose.model('BookInstance', BookInstanceSchema);
```

The new things we show here are the field options:

- `enum`: This allows us to set the llowed values of a string.  In this case we use it to specify the availability status of our books(using an enum means that we can prevent mis-spelling and arbitary values for our status)
- `default`: We use default to se the default status for newly created bookinstances to maintenacne and the default `due_back` date to `now`(note how you can call the Date function when setting the date!)

Everything else should be familiar from our previous schema.


### Testing - create some items

In order to test the models(and to create some example books and other items that we can use in our next article) we'll now run an *independent* script to create items of each type:

1. write the code for the script [populatedb.js](https://raw.githubusercontent.com/hamishwillee/express-locallibrary-tutorial/master/populatedb.js) inside your *express-locallibrary-tutorial* directory(Same level as `package.json`)
2. Enter the following commands in the project root to install *async* module that is required by the script.
`npm install async --save`
3. Run the script using node in your command prompt, passing in the URL of your *MongoDB* database (the same one your replaved the *insert_your_database_url_here* placeholder with, inside `app.js` earlier):
`node populatedb <your mongodb url>`
4. The script should run through to completion, displaying items as it creates them in the terminal.

### Summary

In this article we've learned a bit about databases and ORMs on Node/Express, and a lot about how Mongoose schema and models are defined. We then used this information to design and implement `Book`, `BookInstance`, `Author` and `Genre` models for the LocalLibrary website.

Last of all we tested our models by creating a number of instances (using a standalone script). In the next article we'll look at creating some pages to display these objects.
