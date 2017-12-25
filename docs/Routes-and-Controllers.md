### Routes & Controllers

The Main things we need to create are:
- "Routes" to foward the supported requests (and any information encoded in request URLs)to the appropriate controller functions.
- Controller functions to get the requested data from the models, create an HTML page displaying the data, and return it to the user to view in the browser.
- Views(templates) used by the controllers to render the data.

![alt text](https://mdn.mozillademos.org/files/14456/MVC%20Express.png)

We might have pages to show lists and detail information for books, genres, authors and bookinstances, along with pages to create, update, and delete records. Since that is alot of document in one article, we will set up our rotues and controllers to return "dummmy" content.
