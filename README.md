# nodejs-express Not Complete
![Express](https://img.shields.io/jira/sprint/https/jira.spring.io/94.svg)
[![npm](https://img.shields.io/npm/v/npm.svg)]() [![GitHub top language](https://img.shields.io/github/languages/top/badges/shields.svg)](https://github.com/mattd429/nodejs-express/search?l=javascript)

🎶 node_js using express framework to build a music db

### Creating a project with Express

First we should navigate to where to create our project at and we will use [pug](https://pugjs.org/api/getting-started.html), which is a high performance template engine heavily influences by [Haml](http://haml.info) and implemented with Javascript for [node.js](https://nodejs.org/en/) and browsers, was known as Jade before.

```
express project-name --view=pug
```

The generator will create (and list) the project's files.

```
create : nodejs-express
   create : nodejs-express/package.json
   create : nodejs-express/app.js
   create : nodejs-express/public/images
   create : nodejs-express/public
   create : nodejs-express/public/stylesheets
   create : nodejs-express/public/stylesheets/style.css
   create : nodejs-express/public/javascripts
   create : nodejs-express/routes
   create : nodejs-express/routes/index.js
   create : nodejs-express/routes/users.js
   create : nodejs-express/views
   create : nodejs-express/views/index.pug
   create : nodejs-express/views/layout.pug
   create : nodejs-express/views/error.pug
   create : nodejs-express/bin
   create : nodejs-express/bin/www

   install dependencies:
     > cd nodejs-express && npm install

   run the app:
     > DEBUG=nodejs-express:* npm start
```

At the end of the output generator provides instructions on how you install dependencies(list in the `package.json` file) and then how to run the application.

1. First install the dependencies(the `install` command will get the dependency packages listed in the project's package.json file)
```
cd project-name
npm install

```

2. Then run the application

 - on Windows
 
```
SET DEBUG=project-name:* & npm start
```

- on Mac OS

```
DEBUG=project-name:* npm start
```

3. then load [http://localhost:3000](http://127.0.0.1:3000/)

```
>DEBUG=nodejs-express:* npm start

> nodejs-expressl@0.0.0 start D:\nodejs-express
> node ./bin/www

  nodejs-express:server Listening on port 3000 +0ms
GET / 200 288.474 ms - 170
GET /stylesheets/style.css 200 5.799 ms - 111
GET /favicon.ico 404 34.134 ms - 1335
```

By default when you make changes to Express website they are not available until after a restart of the server(which is a bummer).  There is a toold you may want to use while in dev mode which is called [nodemon](https://github.com/remy/nodemon), our [contributors](https://github.com/remy/nodemon/blob/master/.github/CONTRIBUTING.md).  You usually want to install locally as a dev dependency.

`npm install --save-dev nodemon`

Check out your project's **package.json** file.

```json
"devDependencies": {
    "nodemon": "^1.12.0"
  }

```

Since it is not globally installed we can not launch from CLI(unless we add the path), we call the NPM script, since NPM knows about the installed packages. Just fine the `scripts` section in your `package.json`, the scripts will have one line that starts with `"start"`. Update the scripts by adding `"devstart"`:

```json
"scripts": {
    "start": "node ./bin/www",
    "devstart": "nodemon ./bin/www"
  },
```
Now we can start the server in almost the exact same way as before, but with the `"devstart"` command

```
DEBUG=project-name:* npm run devstart
```

now we can edit files and the server will restart or we can type `rs` on the command prompt anytime. You will still need to reload the browser to refresh the page.


For more information please check out the [documentation](https://github.com/mattd429/nodejs-express/tree/master/docs) section.
