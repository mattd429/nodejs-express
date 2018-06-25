 ## Displaying Library data

### OverView

In our previous tutorial articles we deifned [Mongoose models](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose) that we can use to interact with a databse and created some initial records. We then [created all the routes](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes) needed for the LocalLibrary website, but with "dummy controller" functions (these are skeleton controller functions that just return a "not implemented" message when a page is accessed).

The next step is to provide proper implementations for the pages that display our library information (we'll look at implementing pages featuring forms to create, update, or delete information in later artcles). This includes updating the controller functions to fetch records using our models, and defining templates to siplay this information to users.

We will start by providing overview/primer topics explaining how to manage asynchronous operations in controller functions and how to write templaes using **Pug**. Then we'll provide implementations for each of our main "read only" pages with a brief explanation of any special or new features that they use.

At the end of this artcle you should have a good end-to-end understanding of how routes, asynchronous functions, views, and modles work in practice.

### Asynchronous flow control using async

- (of a computer or other electrical machine) having each operation started only after the preceding operation is completed.

The controller code for some of our *LocalLibrary* pages will depend on the results of mulitple asynchronous requests, which may be required to run either in some particular order or in parallel. In order to manage flow control, or render pages when we have all required information available, we'll use the popular node [async](https://www.npmjs.com/package/async) module.

>**NOTE**: There are a number of ways to manage asynchronous behaviour and flow control in JavaScript, including recent JavaScript language features like [Promises](https://developer.mozilla.org/en-US/Add-ons/Techniques/Promises)
>

Async has alot of useful methods(check out [the documentation](http://caolan.github.io/async/docs.html)). Some of the more important functions are:

- [aync.parrallel()](http://caolan.github.io/async/docs.html#parallel) to execute any operations that must be preformed in parallel.
- [async.series()](http://caolan.github.io/async/docs.html#series) for when we need to ensure that asynchronous operations are preformed in series.
- [async.waterfall()](http://caolan.github.io/async/docs.html#waterfall) for operations that must be run in series, with each operation depending on the results of preceding operations.

### Why is this needed?

Most of the methods we use in *Express* are asynchronous--you specify an operation to perform, passing a callback. The method returns immediatly, and the callback is invoked when the requested operation completes. By convetion in *Express*, callback functions pass an *error* value as the first parameter (or `null` on sucess) and the results from the function (if there are any)as the second parameter.

if a controller only needs to *preform* **one** *asynchronous operation* to get the information required to render a page then the implementation is easy--we simple render the template in the callback. The code fragment below shows this for a function that renders the count of a model `SomeModel`(using the Mongoose [count()](http://mongoosejs.com/docs/api.html#model_Model.count)):

```javascript
exports.some_model_count = function(req, res, next) {

  SomeModel.count({ a_model_field: 'match_value' }, function (err, count) {
  // ... do something if there is an err
  
  // On sucess, render the result by passing count into the render function (here, as the variable 'data')
  res.render('the_template', { data: count } );
 });
}
```
However what is you need to make **multiple** asychronous queries, and you can't render the page until all the operations have completed? A naive implmentation could "daisy chain" the requests, kicking off subsequent requests in the callback of a previous request, and rendering the response in the final callback. The problem with this apprach is that our requests would have to be run in series, even though it might be more efficient to run them in parallel. This could also result in complicated nested code, commonly referred to as [callback hell](http://callbackhell.com/) 

### What is "callback hell"

Asynchronous JavaScript, or JavaScript that uses callbacks, is hard to get right intuitively. A lot of code ends up looking like this:

```javascript
fs.readdir(source, function (err, files) {
  if (err) {
    console.log('Error finding files: ' + err)
  } else {
    files.forEach(function (filename, fileIndex) {
      console.log(filename)
      gm(source + filename).size(function (err, values) {
        if (err) {
          console.log('Error identifying file size: ' + err)
        } else {
          console.log(filename + ' : ' + values)
          aspect = (values.width / values.height)
          widths.forEach(function (width, widthIndex) {
            height = Math.round(width / aspect)
            console.log('resizing ' + filename + 'to ' + height + 'x' + height)
            this.resize(width, height).write(dest + 'w' + width + '_' + filename, function(err) {
              if (err) console.log('Error writing file: ' + err)
            })
          }.bind(this))
        }
      })
    })
  }
})
```

A much better solution would be to execute all the requests in parallel and then have a single callback that executes when all of the queries have completed. This is the sort of flow operation that the *Async* module makes easy!

### Asynchronous operations in parallel

The method [async.parallel()](http://caolan.github.io/async/docs.html#parallel) is used to run multiple asynchronous `tasks` operations in parallel, wihtout waiting until the previous function has completed. if any of the functions pass an error to its callback, the main `callback` is immediately called with the value of the error. Once the `task` have completed, the results are passed to the final `callback` as an array

The first argument to `async.parallel()` is a collection of the asynchronous functions to run(an array, object or other iterable). Each function is passed a `callback(err, result)` which it must call on completion with an error `err`(which can be `null`) and an optional `results` value. 

> **NOTE**:`parallel` is about kicking-off I/O tasks in parallel, not about parallel execution of code. If your tasks do not use any timers or perform any I/O, they will actually be executed in series. Any synchronous setup sections for each task will happen one after the other. JavaScript remains single-threaded.



The optional second argument to `async.parallel()` is a callback that will be run when all the functions in the first argument have completed. The callback is invoked with an error argument and a result collection that contains the results of the individual asynchronous operations. The result collection is of the same type as the first argument (i.e. if you pass an array of asynchronous functions, the final callback will be inoked with an array results). if any of the parallel functions reports an error the callback is invoked earlt (with the error value).

The example below shows how this works when we pass an object as the first argument. As you can see, results are *returned* in an object with the same property names as the orginal functons that were passed in.

```javascript
async.parallel([
    function(callback) {
        setTimeout(function() {
            callback(null, 'one');
        }, 200);
    },
    function(callback) {
        setTimeout(function() {
            callback(null, 'two');
        }, 100);
    }
],
// optional callback
function(err, results) {
    // the results array will equal ['one','two'] even though
    // the second function had a shorter timeout.
});

// an example using an object instead of an array
async.parallel({
    one: function(callback) {
        setTimeout(function() {
            callback(null, 1);
        }, 200);
    },
    two: function(callback) {
        setTimeout(function() {
            callback(null, 2);
        }, 100);
    }
}, function(err, results) {
    // results is now equals to: {one: 1, two: 2}
});
```

If you instead pass an array of functions as the first argument, the results will be an array(the array order results will match the orginal order that the functions were declared-not the order in which they completed).

### Asynchronous operations in series

The method [async.series()](http://caolan.github.io/async/docs.html#series) is used to run multiple asynchronous operations in sequence, when subsequent functions do no depend on the output of earlier functions. It is essentially declared and behaves in the same way as `async.parallel()`.

```javascript
async.series({
  one: function(callback) { ... },
  two: function(callback) { ... },
  ...
  something_else: function(callback) { ... }
  },
  // optional callback after the last asynchronous function completes.
  function(err, results) {
    // 'results' is now equals to: {one: 1, two: 2, ..., something_else: some_value}
  }
);
```

>**NOTE**: The ECMAScript(JavaScript) language specification states that the order of enumeration of an object is undefined, so it is possible that the functions will not be called in the same order as you specify them on all platforms. If the order really is important, then you should pass an array instead of an object, as shown below.
>

```javascript
async.series([
  function(callback) {
    // do some stuff ...
    callback(null, 'one'); 
  },
  function(callback) {
    // do some more stuff ... 
    callback(null, 'two'); 
  } 
 ], 
  // optional callback
  function(err, results) {
  // results is now equal to ['one', 'two'] 
  }
);
```
- The different is we pass the `[]` in our `async.series` to let the function know this will need to be in order.

### Dependent asynchronous operations in series

The [method async.waterfall()](http://caolan.github.io/async/docs.html#waterfall) is used to run multiple asynchronous operations in sequence when each operation is dependent on the result of the previous operation.

The callback invoked by each asynchronous function contains `null` for the first argument and results in subsequent arguments. Each function in the series takes the results arguments of the previous callback as the first parameters, and the a callback function. When all operations are complete, a final callback is invoked with the result of the last operation. The way this works is more clear when you consider the code fragment below(This example is from the *async* documentation):

```javascript
async.waterfall([
  function(callback) {
    callback(null, 'one', 'two');
  },
  function(arg1, arg2, callback) {
    // arg1 now equals, 'one' and arg2 now equals 'two'
    callback(null, 'three');
  },
  function(arg1, callback) {
    // arg1 now eauls 'three'
    callback(null, 'done';)
  }
], function (err, results) {
  // result now equals 'done'
} 
);
```

### Installing async

Install the async module using the NPM package manager so that we can use it in our code. You do this in the usual way, by opening a prompt in the root of the *LocalLibrary* project and enter the following command:

```javascript
npm install async --save
```

## Template primer

a template is a text file defining the *structure* or layout of an output file, with placeholders used to represent where data will be inserted when the template is rendered (in *Express*, templates are referred to as *views*).

Express can be used with many different [template rendering engines](https://expressjs.com/en/guide/using-template-engines.html). In this tutorial we use [Pug](https://pugjs.org/api/getting-started.html)(formerly known as *Jade*) for our templates. This is the most popular Node template language, and describes itself as a "clean, whitespace-sensitive syntax for writing HTML; heavily influences by [Haml](http://haml.info/)"

[Haml](http://haml.info/) is a markup language that's used to cleanly and simply describe the HTML of any web document without the use of inline code. Haml functions as a replacement for inline page templating systems such as PHP, ASP, and ERB, the templating language used in most Ruby on Rails applications, howerver, Haml avoids the need for explicity coding HTML into the template, becuase it itself is a description of the HTML, with some code to generate dynamic content.

Different template langauges use different approaches for defining the layout and marking placeholders for data-some use HTML to define the layout while others use different markup formats that can be complied to HTML. **Pug** is of the second type; it uses a *representation* of HTML where the first word in any line usually represents HTML element, and indentation on subsequent lines is used to represent any content nested with those elements. The result is a page definition that translates directly to HTML, but is arguable more concise and easier to read.

>**NOTE**: The downside of using *Pug* is that it is sensitive to indentation and whitespace (if you add an extra space in the wrong place you may get an unhelpful error code). However once you have your templates in place, they are very easy to read and maintain.
>

### Template configuration

the *LocalLibrary* was configured to use [Pug](https://pugjs.org/api/getting-started.html) when we [created the skeleton website](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website). You should see the pug module included as a dependency in the website's **package.json** file, and the following configuration settings in the **app.js** file. The settings tell us that we're using pug as the view engine, and that *Express* should search for templates in the **/views** subdirectory.

```javascript
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('views.engine', 'pug')
```

If you look in the views direcotry you will see the .pug files for the project's default views. These include the view for the home page(**index.pug**) and base template (**layout.pug**) that we will need to replace with our own content.

```ls
/express-locallibrary-tutorial  //the project root
  /views
    error.pug
    index.pug
    layout.pug
```

### Template syntax

The example template file below shows off many Pug's most useful features.

The first thing to notice is that the file maps the structure of a typical HTML file, with the first word in (almost) every line being na HTML element, and indentation being used to indicate nested elements. So for example, the `body` element is indide an `html` element, and paragraph elemtns (`p`) are within the `body` element, etc. Non-nested elements (e.g. individual paragraphs) are on seperate lines.

```HTML
doctype html
html(lang="en")
  head
    title= title
    script(type='text/javascript').
  body
    h1= title
    
    p This is a line with #[em some emphasis] and #[string string text] markup.
        p This line has un-escaped data: !{'<em> is emphasised</em>'} and escaped data: #{'<em> is not emphasised</em>'}. 
      | This line follows on.
    p= 'Evaluated and <em>escaped expression</em>:' + title

    <!-- You can add HTML comments directly -->
    // You can add single line JavaScript comments and they are generated to HTML comments
    //- Introducing a single line JavaScript comment with "//-" ensures the comment isn't rendered to HTML 
    
    p A line with a link 
      a(href='/catalog/authors') Some link text
      |  and some extra text.
    
    #container.col
      if title
        p A variable named "title" exists.
      else
        p A variable named "title" does not exist.
      p.
        Pug is a terse and simple template language with a
        strong focus on performance and powerful features.
        
    h2 Generate a list
    
    ul
      each val in [1, 2, 3, 4, 5]
        li= val
```
Element attributes are defined in parentheses after their associated element. Inside the parentheses, the attributes are defined in comma- or whitespace-seperated lists of the pairs of attibute names and attribute values, for example:

- script(type='text/javascript'),
  link(rel='stylesheet',
  href='/stylesheets/style.css')
- meta(name='viewport' content='width=device-width initial-scale=1')

The values of all attributes are *escaped* (e.g. characters like "`>`" are converted to their HTML code equilvalents like "`&gt;`") to prevent injection of Javascript/cross-site scripting attacks.

If a tag is followed by the equal sign, the following text is treated as a JavaScript *expression*. So for example, in the first line below, the content of `h1` tag will be *variable* `title`(either defined in the file or passed into the template from Express). in the second line the paragraph content is a text string concatented with the `title` variable. in both cases the default behaviour is to *escape* the line.

```html
h1= title
p= 'Evaluated and <em>escaped expression</em>' + title
```
If there is no equals symbol after the tag then the content is treated as plain text. Within the plain text you can insert [escaped](https://www.ibm.com/support/knowledgecenter/en/SSGMGV_3.1.0/com.ibm.cics.ts31.doc/dfhtl/topics/dfhtl20.htm) and unescaped data using `#{}` and `!{}` syntax, as shown below. you can also add raw HTML within the plain text.

```html
p This is a line with #[em some emphasis] and #[string stron text] markup.
p This is a line has an un-escaped stirng: !{'<em> is emphasised</em>'}, and escaped string: #{'<em> is not emphasised</em>'}, and escaped variables: #{title}.
```

>**Tip**: You will almost alway want to escape data from users (via the `#{}` syntax). Data that can be trusted(e.g. generated counts of records, etc) may be displayed without escaping the values.
>

You can use the pipe('|') character at the beginning of a line to indicate [plain text](https://pugjs.org/language/plain-text.html). For example, the additional text shown below will be displayed on the same line as the preceding anchor, but will not be linked.

```html
a(href='http://someurl/') Link test
| Plain text
```

Pug allows you to perfom conditional operations using `if`, `else`, `else if` and `unless`-for example:

```html
if title
  p AVariable name "title" exists
else
  p A variable named "title" does not exist
```

You can also perform loop/iteration operations using `each-in` or `while` syntax. In the code fragment below we've looped through an array to display a list of variables (note the use of the 'li=' to evaluate the "val" as a variable below. The value you iterate across can also be passed into the template as a variable!)

```html
ul
  each val in [1, 2, 3, 4, 5]
    li= val
```

The syntac supports comments (that can be rendered in the output-or not-as you choose), mixings to create reusable blocks of code, case statements, and many other features. For more detailed information see [The Pug docs](https://pugjs.org/api/getting-started.html).

### Extending templates

Across a site, it is usual for all pages to have a common structure, including standard HTML markup for the head, footer, navigation, etc. Rather then forcing developers to duplicate this "bolierplate" in every page. *Pug* allows you to declare a base template and then extend it, replacing just the bits that are different for each specific page.

for example, the base template **layout.pug** created in out [skeleton project](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/skeleton_website) looks like this:

```html
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
```

The `block` tag is used to mark up sections of contents that may be replaced in a derived template(if the block is not redefined then its implementation in the base class is used).

The default **index.pug** (created for our skeleton project) shows how we override the base template. The `extends` tag identifies the base template to use, and then we use `block section_name` to indicate the new content of the section that we will override.

```html
extends layout

block content
  h1= title
  p Welcome to #{title}
```

### The LocalLibrary base template

Now that we understand how to extend templates using Pug, let's start by creating a base template for the project. This will have a sidebar with links for the pages we hope to create across the tutorial articles (e.g. to display and create books, genres, authors, etc.)and a main content area that we'll override in each of our individual pages.

Open **/views/layout.pug** and replace the content with the code below.

```html
doctype html
html(lang='en')
  head
    title= title
    meta(charset='utf-8')
    meta(name='viewport', content='width=device-width, initial-scale=1')
    link(rel='stylesheet', href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css')
    script(src='https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js')
    script(src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js')
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    div(class='container-fluid')
      div(class='row')
        div(class='col-sm-2')
          block sidebar
            ul(class='sidebar-nav')
              li 
                a(href='/catalog') Home
              li 
                a(href='/catalog/books') All books
              li 
                a(href='/catalog/authors') All authors
              li 
                a(href='/catalog/genres') All genres
              li 
                a(href='/catalog/bookinstances') All book-instances
              li 
                hr
              li 
                a(href='/catalog/author/create') Create new author
              li 
                a(href='/catalog/genre/create') Create new genre
              li 
                a(href='/catalog/book/create') Create new book
              li 
                a(href='/catalog/bookinstance/create') Create new book instance (copy)
                
        div(class='col-sm-10')
          block content
```

The template uses(and includes) java script and CSS from [Bootstrap](http://getbootstrap.com/) to improve the layout and presentation of the HTML page. Using Bootstrap or another client-side web framework is a quick way to create an attractive page that can scale well on different browser sizes, and it also allows us to deal with the page presentation without having to get into any of the details-we just want to focus on the server-side code here!

The layout should be fairly obvious if you've read our above [Template primer](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Displaying_data#Template_primer). Note the use of `block content` as a placeholder for where the content for our individual pages will be places.

The base template also references a local css (**style.css**) that provides a little additional styling. Open **/public/stylesheets/style.css

and replace its content with the following CSS code:

```css
.sidebar-nav {
    margin-top: 20px;
    padding: 0;
    list-style: none;
}
```

When we get round to running our site, we should see the sidebar appear! In the next sections we will use the above layout to define the individual pages.

-----------

# Home page

The first page we'll create will be the website home page, which is accessible from either the site (`'/'`) or catalog (`catalog/`) root. This will display some static text describing the site, along with synamically calculate "counts" of different record types in the database.

We've already created a route for the home page. In order to complete the page we need to update our controller function to fetch "counts" of records from the databse, and create a view (template) that we can use to render the page.

### Route

we created our index page routes in a [previous tutorial](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes). As a reminder, all the route functions are defined in **/routes/catalog.js:**

```javascript
/* GET catalog home page. */
router.get('/', book_controller.index); //This actually maps to /catalog/ because we import the route with a /catalog prefix.
```

Where the callback function parameter (**book_controller.index**) is defined in **/controllers/bookController.js:**

```javascript
exports.index = function(req, res, next) {
    res.send("NOT IMPLMENETED: Site Home Page");
}
```
it is this controller function that we extend to get information from our models and then render it using a temple (view)

### Controller

The index controller function need to fetch information about how many `Book`, `BookInstance`, available `BookInstance`,`Author`, and `Genre` records we have in the database, render this data in a template to create an HTML page, and then return it in an HTTP response.

>**NOTE**: We use the [count()](http://mongoosejs.com/docs/api.html#model_Model.count) method to get the number of instances of each model. This is called on a model with an optional set of conditions to match against in the first argument and a callback in the second argument(as discussed in [Using a Database (with Mongoose)](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose)), and you can also reutrn a `Query` and then execute it with a callback later. The callback will be returned when the database returns the count, with an error value (or `null`) as the first parameter and the count of records (or null if there was an error) as the second parameter.
>

```javascript
SomeModel.count({ a_model_field: 'match_value' }, function (err, count) {
  // ... do something if there is an err
  // ... do something with the count if there was no error
});
```

Open **/controllers/bookController.js**. Near the top of the file you should see the exported `index()` function.

```javascript
var Book = require('../models/book')

exports.index = function(req, res, next) {
 res.send('NOT IMPLEMENTED: Site Home Page'); 
}
```

Replace all the code above with the following code fragment. The first thing this does is import (`require()`) all the models(highlighted in bold). We need to do this becuase we'll be using them to get out counts of records. it then imports the *async* module.

```javascript
var Book = require('../models/book');
var Author = require('../models/author');
var Genre = require('../models/genre');
var BookInstance = require('../models/bookinstance');

var async = require('async');

exports.index = function(req, res) {
  
  async.parallel({
      book_count: function(callback) {
          Book.count(callback);
      },
      book_instance_count: function(callback) {
          BookInstance.count(callback);
      },
      book_instance_available_count: function(callback) {
          BookInstance.count({status:'Available'}, callback);
      },
      author_count: function(callback) {
          Author.count(callback);
      },
      genre_count: function(callback) {
          Genre.count(callback);
      },
  }, function(err, results) {
      res.render('index', {title: 'Local Library Home', error: err, data: results});
  });

};
```

The `async.parallel()` method is passed an object with functions for getting the counts for each models. These functions are all started at the same time. When all them have completed the final callback is invoked with the counts in the results parameter (or an error).

on success the callback function calls [res.render()](http://expressjs.com/en/4x/api.html#res.render), specifying a view(template) named 'index' and and object containing the data that is to be inserted into it (this includes the results objects that contains our model counts). The data is supplied as key-value pairs, and can be accessed in the template using the key.

>**NOTE**: The callback function from `async.parallel()` above is a little unusual in that we render the page whether or not there was an error(normally you might use a seperate execution oath for handling the display of errors).
>

### View

Open **/views/index.pug** and replace its content with the text below.

```pug
extends layout

block content
  h1= title
  p Welcome to #[em LocalLibrary], a very basic Express website developed as a tutorial example on the Mozilla Developer Network.
  
  h1 Dynamic content
  
  if error
    p Error getting dynamic content.
  else 
    p The library has the following record counts.
    
    ul
      li #[strong Books:] !{data.book_count}
      li #[strong Copies:] !{data.book_instance_count}
      li #[strong Copies availble:] !{data.book_instance_available_count}
      li #[strong Authors:] !{data.author_count}
      li #[strong Genres:] !{data.genre_count}
```
The view is straightforward. We extend the **layout.pug** base template, overriding the `block` named '**content**'. The first `h1` heading will be the escaped text for the `title` variable that was passed into the `render()` function-note the use of the '`h1=`' so that the following text is treated as a JavaScript expression. We then include a paragraph introducing the LocalLibrary.

Under the *Dynamic content* heading we check whether the error passed in from the `render()` function has been defined. If so, we note the error. If not, we get and list the number of copies of each model from the `data` variable.

>**NOTE**: We didn't escape the count values(i.e. used the `!{}` syntax) because the count values are calculated. If the information was supplied by end-users then we'd escape the variable for display.
>

### What does it look like?

At this point we should have created everything needed to display the index page. Run the application open your browser to [http://localhost:3000](http://127.0.0.1:3000). if everything is setup correctly, your site should look something like the following screenshot.

![alt text](https://mdn.mozillademos.org/files/14458/LocalLibary_Express_Home.png)

>**NOTE** You won't be able to use the sidebar links yet because the urls, views, and templates for those haven;t been defined. If you try you'll get errors like "NOT IMPLEMENTED: Book list" for example, depending on the link you click on. these string literals(which will be replaced with proper data) were specified in the different controllers that live inside your "controllers" file.
>

### Book List page.

Next we'll implement our book list page. This page needs to display a list of all books in the database along with their author, with each book title being a hyperlink to its associated book detail page.

#### Controller

The book list controller function needs to get a list of all `Book` objects in the database, and then pass these to the template for rendering.

Open **/controllers/bookController.js**. Find the exported `book_list()` controller methiod and replace it with the following code.

```javascript
// Display list of all Books
exports.book_list = function(req, res, next) {
  
  Book.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if(err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books});
    });
};
```
The method uses the model's `find()` function to return all `Book` objects, selecting to return only the `title` and `author` as we don't need the other fields (it will also return the `_id` and virtual fields). Here we also call `populate()` on `Book`, specifying the `author`field-this will replace the stored book author id with the full author details.


On success, the callback passed to the query renders the **book_list**.(pug) template, passing the `title` and `book_list`(list of books with authors) as variables.

### View

Create **/views/book_list.pug** and write in the code below.

```pug
extends layout

block content
  h1= title
  
  ul
  each book in book_list
    li 
      a(href=book.url) #{book.title} 
      |  (#{book.author.name})

  else
    li There are no books.
```

The view extends the **layout.pug** base template and overrides the `block` named **`content`**. it displays the `title` we passed in from the controller (via the `render`() method) and then iretates though the `book_list` variable using the `each`-`in`-`use` syntax. A list item is created for each book displaying the book title as a link to the book's detail page followed by the author name. If there are no books in the `book_list` then the `else` clause is executed, and displays the text 'There are no books'.

>**NOTE:** We use `book.url` to provide the link to the detail record for each book(we've implemented this route, bu not the page yet). This is a virtual property of the `Book` model which uses the model instance's `_id` field to produce a unique URL path.
>

Of interest here is that each book is defined as two lines, using the pipe for the second line (highlighted above). This approach is needed becuase if the author name were were on the previoud line then it would be part of the hyperlink.

### What does it look like?

Run the application (see [Testing the routes](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/routes#Testing_the_routes) for the relevant commands) and open your browser to [http://localhost:3000](http://127.0.0.1:3000/). Then select the *All books* link. If everything is setup correctly, your site should look something like the following screenshot.

![alt text](https://mdn.mozillademos.org/files/14464/LocalLibary_Express_Book_List.png)


### BookInstance list page

Next we'll implement our list of all book copies(`BookInstance`) in the library. This page needs to include the title of the `Book` associated with each `BookInstance` (linked to its detail page) along with other information in the `BookInstance` model, including the status, imprint, and unique if of each copy. The unique if text should be linked to the `BookInstance` detail page.

### Controller

The `BookInstance` list controller function needs to get a list of all book instances, populate the associated book information, and then pass the list to the template for rendering.

Open **/controllers/bookinstanceController.js**. Find the exported `bookinstance_list()` controller method and replace it with the following code (the changed code is down in bold).

```javascript
// Display list of all BookInstances
exports.bookinstance_list = function(req, res, next) {
  
  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstance) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance', bookinstance_list: list_bookinstances });
    });

};
```

The method uses the model's `find()` function to return all `BookInstance` objects. It then daisy-chains a call to `populate()` with the `book` field-this will replace the book id stored for each `BookInstance` with a full `book` document.

On success, the callback passed to the query renderes the **bookinstance_list**(.pug) template, passing the `title` and `bookinstance_list` as variables.

### View

Create **views/bookinstance_list.pug** and copy in the text below.

```pug
extends layout

block content
  h1= title
  
  ul
  each val in bookinstance_list
    li
      a(href=val.url) #{val.book.title} : #{val.imprint} -
      if val.status=='Available'
        span.text-success #{val.status}
      else if val.status=='Maintenance'
        span.text-danger #{val.status}
      else
        span.text-warning #{val.status}
      if val.status!='Available'
        span (Due: #{val.due_back} )
        
  else
    li There are no book copies in this library.
```
This view is much the same as all the others. It extends the layout, replacing the *content block*, displays the `title` passed in from the controller, and iterates through all the book copies in `bookinstance_list`. For each copy we display its status(colour coded) and if the book is not available, its expected return date. One new feature is introduced-we can use dot notation after a tag to assign a class. So `span.text-success` will be compilied to `<span class="text-success">`(and might also be written in Pug as `span(class="text-success")`.

###### What does it look like?

Run the application, open your browser to [http://localhost:3000/](http://127.0.0.1:3000/), then select the *All book-instances* link. If everything is setup correctly, your site should look something like the following screenshot.

![alt text](https://mdn.mozillademos.org/files/14474/LocalLibary_Express_BookInstance_List.png)


### Date formatting using moment

The feault rendering of dates from our models is very ugly: *Tues Jan 02 2018 17:37:08 GMT-0500 (EST)*. In this section we'll show how you can update the *BookInstance List* page from the previous section to present the `due_date` field in a more friendly format: January 2nd, 2018.

The approach we will use is to create a virtual property in our `BookInstance` model that returns the formatted date. We'll do the actual formatting using [moment](https://www.npmjs.com/package/moment), a lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.

>**NOTE**: It is possible to use moment to format the strings directly in out Pug templates, or we could format the string in a number of other places. Using a virtual property allows us to get the formatted date in exactly the same way as we get the `due_date` currently.
>

###### install moment

Enter the following command in the root of the project:

```javascript
npm install moment --save
```


#### Create the virtual property

1. Open **./models/bookinstance.js**.
2. At the top of the page, import moment.
```javascript
var moment = require('moment');
```

Add the virtual property `due_back_formatted` just after the url property.

```javascript
// create the db Scheme
BookInstanceSchema
 //  set due back format after the url prop.
 .virtual('due_back_formatted')
 .get(function () {
   return moment(this.due_back).format('MMMM Do, YYYY');
 });
 ```
 
 >**NOTE**: The format method can display a date using almost any pattern. The syntax for representing different date components can be found in the [Moment.js | Docs](http://momentjs.com/docs/#/displaying/)
 >
 
 ### Update the view
 
 Open **/views/bookinstance_list.pug** and replace `due_back` with `due_back_formatted`.
 
 ```pug
    if val.status!='Available'
       // span (Due: #{val.due_back} )
       span (Due: #{val.due_back_formatted} )
```






