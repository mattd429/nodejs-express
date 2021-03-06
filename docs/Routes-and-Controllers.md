### Routes & Controllers

The Main things we need to create are:
-  "Routes" to foward the supported requests (and any information encoded in request URLs)to the appropriate controller functions.
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

### Route Functions

Our module above defines a couple of typical route functions. The "about" route(reproduced below) is define using `Route.get()` method, which responds only to HTTP GET requests. The first argument to this method is the URL path while the second is a callback function that will be invoked if an HTTP GET request with the path is receieved.

```javascript
router.get('/about', function(req, res) {
  res.send('About this wiki');
});
```
The callback takes three arguments (usually named shown:`req`,`res`,`next`), that will contain the HTTP Request object, HTTP response, and the *next* function in the Middleware chain.

> **Note**: Router functions are [Express middleware](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction#Using_middleware), which means that they must either complete (respond to) the request or call the next function in the chain. In the case above we complete the request, so the `next` argument is not actually used.
> 

The callback function here calls [send()](https://expressjs.com/en/4x/api.html#res.send) on the response to return the string "About this wiki" when we recieve a GET request with the path `/about`. There are a [number of other response methods](https://expressjs.com/en/guide/routing.html#response-methods) for ending the request/response cycle. For example, you could call [res.json()](https://expressjs.com/en/4x/api.html#res.json) to send a JSON response or [res.sendFile()](https://expressjs.com/en/4x/api.html#res.sendFile) to send a file. The response method that we'll be using most often as we build up the library is [render()](https://expressjs.com/en/4x/api.html#res.render), which creates and returns HTML files using templates and data.

### HTTP verbs

The example routes above use the `Router.get()` method to respond to HTTP GET requests with a certain path.

The `Router` also provides route methods for all the other HTTP verbs, that are mostly used in exactly the same way:

`post()`,`put()`,`delete()`,`options()`,`trace()`,`copy()`,`lock()`,`mkcol()`,`move()`,`purge()`,`propfind()`,`proppatch()`,`unlock()`,`report()`,`mkactivity()`,`checkout()`,`merge()`,`m-search()`,`notify()`,`subscribe()`,`unsubscribe()`,`patch()`,`search()`,and `connect()`.

for example, the code below behaves just like the previous `/about` route, but only responds to HTTP POST requests.

```javascript
router.post('/about', function(req, res) {
  res.send('About this wiki');
});
```

#### Route paths

The route paths define the endpoints at which requests can be made. The examples we've seen so far have just been strings, and are used exactly as written: `'/'`,`'/about'`,`'/any-randon.path'`.

Route paths can also be string patterns. String patterns use a subset of regular expression syntax to define patterns of endpoints that will be matched. The subset is listed below(not that the hypen `-` and the dot `.` are interpreted literally by string-based paths):

- ?: The endpoint must have 0 or more of the preceding character. e.g. a route path of `/ab?cd` will match endpoints `acd`,`abcd`, `abbcd`, etc.
- +: The endpoint must have 1 or more of the preceding character. E.g. a route path of `ab+cd/` will match endpoints `abcd`, `abbcd`, `abbbcd`, and so on.
- *: The endpoint may have an arbitrary string the * characater is placed.  E.g. a route path of `ab*cd` will match endpoints `abcd`,`abXcd`, `abSOMErandomTEXTcd`, and so on.
- (): Grouping match on a set of characters to perform another operation on. E.g `/ab(cd)?e` will perform a ? match (cd) - it will match `abe`,`abcde`,`abcdcde`, and so on.

The route paths can also be JavaScript [regular expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions). For example, the route path below will match `catfish` and `dogfish`, but not `catflap`, `catfishhead`, and so on. Note that the path for a regular expression uses regular expression syntax(it is not a quoted strings as in the previous cases).
```javascript
// match any routes path that neds in fish...
app.get(/.*fish$/, function (req, res) {
  ...
});
```
>**NOTE**: Most of our routes for the nodejs-express will simply use strings and not string patterns and regular expressions.

### Route parameters

Route parameters are named *URL segments* used to capture at their position in the URL. The named segments are prefixed with a colon and then the name(e.g. `/:your_parameter_name/`. The captured values are stored in the `req.params` object using the parameter names as keys (e.g. `req.params.your_parameter_name`).

for example, consider a URL encoded to contain information about users and albums:
`http://localhost:3000/users/34/albums/8989`. We can extract information as shown below, with the `userId` and `albumId` path parameters:
```javascript
app.get('/users/:userId/albums/:albumId', function (req, res) {
  // Access userId via: req.params.userId
  // Access albumId via: req.params.albumId
  res.send(req.params);
});

```
The names of route parameters must be made up of "word characters" (A-Z, a-z, 0-9, and _).
