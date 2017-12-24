### Express-Framework


we have a `package.json` file defines the application dependecies and other information.

```json
{
  "name": "nodejs-express",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www"
  },
  "dependencies": {
    "body-parser": "~1.15.2",
    "cookie-parser": "~1.4.3",
    "debug": "~2.2.0",
    "express": "~4.14.0",
    "morgan": "~1.7.0",
    "pug": "~2.0.0-beta6",
    "serve-favicon": "~2.3.0"
  },
  "devDependencies": {
    "nodemon": "^1.11.0"
  }
}
```
The dependecies include the express package and the package for our selected view engine(pug). In addition, we have the following packages that are useful in many web applications:

  - [body-parser](https://www.npmjs.com/package/body-parser): This parses the body portion of an incoming HTTP request and makes it easier to extract different parts of the contained information.  For example, you can use this to read `POST` parameters.
  - [cookie-parser](https://www.npmjs.com/package/cookie-parser): Used to parse the cookie header and populate `req.cookies` (essentially provides a convenient method for accessing cookie information).
  - [debug](https://www.npmjs.com/package/debug): A tiny node debugging utility modeled after node core's debugging technique.
  - [morgan](https://www.npmjs.com/package/morgan): An HTTP request logger middleware for node.
  - [serve-favicon](https://www.npmjs.com/package/serve-favicon): Node middleware for serving a [favicon](https://en.wikipedia.org/wiki/Favicon) (This is the icon used to represent the site inside the browser tab, bookmarks, etc.)
  
The scripts section defines a "start" script, which is what we are invoking when we call `npm start` to start the server. From the script definition you can see that this actually starts the JavaScript file **./bin/www** with node. It also defines a "devstart" script, which we invoke when calling npm run devstart instead. This starts the same **./bin/www** file, but with nodemon rather than node.

```json
"scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www"
  },
  ```
### www file

The file **/bin/www** is the application entry point! The very first thing this does is `require()` the "real" application entry point(**app.js**, in the project root)that sets up and returns the [express()](http://expressjs.com/en/api.html) application object.

```javascript
#!/usr/bin/env node

/**
 * Module dependencies
 */
 
var app = require('../app');
```
**Note!!**: `require()` is a global node function that is used to import modules into the current file.

The remainder of the code in the `www` file sets up a node HTTP server with `app` set to a specific port (defined in an enviroment variable or 3000 if the varible isn't defined), and starts listening and reporting server errors and connections.  Everything is this file is a **"boilerplate"**

### app.js

This file creates an `express` application object(named `app`, by convention), sets up the application with various settings and middleware, and then exports the app from module.  Code below shows just the parts of the file that create and export the app object:

```javascript
var express = require('express');
var app = express();
...
module.exports = app;
```
the **www** entry point file above, is it this `module.exports` object that is supplied to the caller when this file is imported.

in our **app.js** file we first have import some useful node libraries into the file using `require()`, inclduing express, server-favicon, morgan, cookie-parser and body-parser that we previously downloaded for our applications using NPM; and path, which is a core Node library for parsing file and directory paths.

```javascript
var express = require('express');
var path = require('path');
var favicon = require('favicon');
var logger = require('logger');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
```
Then we `require()` modules from our routes directory.  These modules/files contain code for handling particular sets of related "routes"(URL paths).  when we extend the skeleton application, for  example to list all albums in the library, we will add a new file for dealing with album-realated routes.

```javascript
var index = require('./routes/index');
var users = require('./routes/users');
```
**Note**: we just imported the module; we haven't actually used its routes yet.

Next we create the `app` object using imported express module, and then use it to set up the view(template) engine.  There are two parts to setting up the engine.  First we set the `'views'` values to specify the folder where the templates will be stored(in this case the sub folders **/views**). Then we set the `'view engine'` value to specify the template library(in this case"pug").

```javascript
var app = express();

// views engine setup, we are setting views to sub folder called views
app.set('views', path.join(__dirname, 'view'));
// setting the views engine to 'pug'
app.set('views engine', 'pug');
```
The next set of functions call `app.use()` to add the *middleware* libraries into the request handling chain. in addition to the 3rd party libraries we imported previously, we use the `Express.static` middleware to get *Express* to serve all the static files in the directory **/public** in the project root.

## bodyParser.json([options]) 

returns middleware that only parses `json` and only looks at requests where the `Content-Type` header matches the `type` option.  This parse accepts any Unicode encoding of the bdoy and supports automatic inflation of [gzip](https://en.wikipedia.org/wiki/Gzip) and [deflate](https://en.wikipedia.org/wiki/DEFLATE)

### bodyParser.urlencoded([options])

same as above. 
`extended` options allows to choose between parsing the URL-encoded data with the `querystring` library when `false`.

```javascript
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
```
Now that all the other middleware is set up, we add our(previously imported) route-handling code to the request handling chain. The imported code will define particular routes for the different parts of the site:

```javascript
app.use('/', index);
app.user('/users', users);
```
The last middleware in the file adds handler methods for errors HTTP 404 responses.

### res.locals

An object that contains response local variable scoped to the request, and therefor available only to the views(s) rendering during that request / response cycle(if any),

```Javascript
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err)
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development mode
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
```
The Express application object(app) is not full configured
