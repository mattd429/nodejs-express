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
