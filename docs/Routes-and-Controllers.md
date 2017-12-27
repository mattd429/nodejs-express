### Routes & Controllers

The Main things we need to create are:
- "Routes" to foward the supported requests (and any information encoded in request URLs)to the appropriate controller functions.
- Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.
- Views(templates) used by the controllers to render the data.

![alt text](https://mdn.mozillademos.org/files/14456/MVC%20Express.png)

We might have pages to show lists and detail information for books, genres, authors and bookinstances, along with pages to create, update, and delete records. Since that is alot of document in one article, we will set up our rotues and controllers to return "dummmy" content.

The first section will provide a brief "primer" on how to use the Express [Router](http://expressjs.com/en/4x/api.html#router) middleware.

### Routes primer

A route is a section of Express code that associates an HTTP verb(`GET`, `POST`, `PUT`, `DELETE`, etc), an URL path/pattern, and a function that is called to handle that pattern.

There are alot of ways to create routes, but here we will use [express.Router](http://expressjs.com/en/guide/routing.html#express-router) middleware as it allows us to group the route handlers for a particular part of a site together and access them using a common route-prefix.  We are goin to keep all library-related routes in a "inventory" module, and, if we add routes for handling user accounts or other functions, we can keep them grouped seperately. Therest of this section provides an overview of how the `Router` can be used to define the routes.

### Defining and using seperate routes modules

The code below provides a concreate example of how e can create a route module and then use it in *Express* application

First, we create routes for a wiki in a module **wiki.js**. The code first imports the Express application object, uses it to get a `Router` object and then adds a couple of routes to it using the `get()` method. Last of all the module exports the `Router` object.

```javascript
// wiki.js - Wiki routes module

var express = require('express');
var router = express.Router();

// Home page router
router.get('/', function (req, res) {
  res.send('Wiki home page');
});

// About page route
router.get('/about', function(req, res) {
  res.send('About this wiki');
});

module.exports = router;
```

**Note**: above we are defining our route handler callbacks directly in the router functions. In the nodejs-express we'll define these callbacks in a seperate controller module.

To use the router in our main app file we first `require()` the route module **wiki.js**. We then call `use()` on the *Express* application to add the Router to the middleware handling path, specifying an URL path of 'wiki'.

This below will be in our app file.
```javascript
var wiki = require('./wiki.js');
// ...
app.use('/wiki', wiki);
```
The two routes defined in our wiki route module are then accessible from `/wiki/` and `/wiki/about/`
