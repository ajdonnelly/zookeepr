//importing both the api routes and html routes we've modularized out
//The require() statements will read the index.js files in each of the directories indicated.
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

//require express to bring into server.js
const express = require('express');

// When Heroku runs our app, it sets an environment variable called process.env.PORT. We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;

/*initiate the server-We assign express() to the app variable 
so that we can later chain on methods to the Express.js server.*/
const app = express();

//we can set up some more Express.js middleware that 
//instructs the server to make certain files readily available 
//and to not gate it behind a server endpoint.
//this is bringing in all our front end assets and making them 
//available to the server
app.use(express.static('public'));

// parse incoming string or array data
// middleware-This is a method executed by our Express.js server that mounts a function to the server that our requests will pass through before getting to the intended endpoint.
// method built into Express.js. It takes incoming POST data and converts it to key/value pairings that can be accessed in the req.body object.
//The extended: true option set inside the method call informs our server that there may be sub-array data nested in it as well, so it needs to look as deep into the POST data as possible to parse all of the data correctly.
// express.static() method. The way it works is that we provide a file path to a location in our application (in this case, the public folder) and instruct the server to make these files static resources. This means that all of our front-end code can now be accessed without having a specific server endpoint created for it!
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
//The express.json() method we used takes incoming POST data in the form of JSON and parses it into the req.body JavaScript object. 
app.use(express.json());

//This is our way of telling the server that any time a client navigates to <ourhost>/api, the app will use the router we set up in apiRoutes. If / is the endpoint, then the router will serve back our HTML routes.
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
//   });

//method to make our server listen
//instead of fixed port, use PORT variable defined above
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });


  
  

  