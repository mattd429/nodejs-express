# nodejs-express

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
