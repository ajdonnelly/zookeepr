// creating a route that the front-end can request data from
const { animals } = require('./data/animals');

//require express to bring into server.js
const express = require('express');

// When Heroku runs our app, it sets an environment variable called process.env.PORT. We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;

/*initiate the server-We assign express() to the app variable 
so that we can later chain on methods to the Express.js server.*/
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// app.listen(3001, () => {
//     console.log(`API server now on port 3001!`);
//   });

//method to make our server listen
//instead of fixed port, use PORT variable defined above
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

  // instead of handling the filter functionality 
  //inside the .get() callback, we're going to break it out 
  //into its own function
  function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray,
        // but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults
        // array will then contain only the entries that contain the trait,
        // so at the end we'll have an array of animals that have every one 
        // of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }
//   function that takes in the id and array of animals and returns a single animal object
  function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
  }

//get callback
//add the route for "animals" data-  "req" describes the route the client 
//will have to fetch from. "res" is a callback function that will 
//execute every time that route is accessed with a GET request.
app.get('/api/animals', (req, res) => {
    let results = animals;
    // call the filterByQuery() in the app.get() callback 
    // /This function will take in req.query as an argument 
    //and filter through the animals accordingly, returning 
    //the new filtered array.
    if (req.query) {
      results = filterByQuery(req.query, results);
    }
    res.json(results);
  });

  app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      // To send JSON, use json method this is attached to the res callback function
      
      res.json(result);
    } else {
      res.send(404);
    }
  });

  app.post('/api/animals', (req, res) => {});app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be
    console.log(req.body);
    res.json(req.body);
  });