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

There are alot of ways to create routes, but here we will use [express.Router](http://expressjs.com/en/guide/routing.html#express-router) middleware as it allows us to group the route handlers for a particular part of a site together and access them using a common route-prefix.  We are goin to keep all library-related routes in a "catalog" module, and, if we add routes for handling user accounts or other functions, we can keep them grouped seperately. Therest of thsi section provides an overview of how the `Router` can be used to define the routes.
