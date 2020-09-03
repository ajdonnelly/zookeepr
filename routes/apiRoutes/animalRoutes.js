//we cannot use app any longer, because it's defined in the server.js file and cannot be accessed here. Instead, we'll use Router, which allows you to declare routes in any file as long as you use the proper middleware.

//start an instance of Router:
const router = require('express').Router();

// const path = require('path');

// creating a route that the front-end can request data from
// whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use
const { animals } = require('../../data/animals');
const {filterByQuery, findById, createNewAnimal, validateAnimal} = require('../../lib/animals');


//get callback
//add the route for "animals" data-  "req" describes the route the client 
//will have to fetch from. "res" is a callback function that will 
//execute every time that route is accessed with a GET request.
router.get('/animals', (req, res) => {
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

  // new GET route for animals-we want to use params, which needs to be defined in a new route pather, so we need to make one
  //param route must come after get route
  router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
      // To send JSON, use json method this is attached to the res callback function
      
      res.json(result);
    } else {
      res.send(404);
    }
  });

  //route that listens for POST requests, not GET requests
  //method of the app object that allows us to create routes
  router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    //when we receive new post data to be added to the animals.json 
    //file, we'll take the length property of the animals array 
    //(because it's a one-to-one representation of our animals.json 
    //file data) and set that as the id for the new data.
    req.body.id = animals.length.toString();
      // add animal to json file and animals array in this function
    // if any data in req.body is incorrect, send 400 error back
  if (!validateAnimal(req.body)) {
    res.status(400).send('The animal is not properly formatted.');
  } else {
    const animal = createNewAnimal(req.body, animals);
    res.json(animal);
  }
});

module.exports  = router;