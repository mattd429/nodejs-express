## MongoDB

#### Best way to interact with a database
There are two approaches for interacting with database:

  - Using the databases' native query lanaguage (e.g. SQL)
  - Using an Object Data Model("ODM")/Object Relational Model("ORM").  An ORDM/ORM represents the website's data as javascript objects, which are then mapped to the underlying database.  Some ORMs are tied to a specific database, while others provide a databse-agnostic backend

Best *performance* can be gained using SQL, ODM is often slower because they translate code to map between objects and db formats.

The benefits of ORM is that the programmer can continue to think in terms of writing in JS objects rather then db semantics.

