//require express to bring into server.js
const express = require('express');

// When Heroku runs our app, it sets an environment variable called process.env.PORT. We're going to tell our app to use that port, if it has been set, and if not, default to port 80
const PORT = process.env.PORT || 3001;

/*initiate the server-We assign express() to the app variable 
so that we can later chain on methods to the Express.js server.*/
const app = express();

// We'll have to not only use .push() to save the new data 
//in this local server.js copy of our animal data, but 
//we'll also have to import and use the fs library to write 
//that data to animals.json.
const fs = require('fs');
const path = require('path');

// creating a route that the front-end can request data from
// whenever we use require() to import data or functionality, it's only reading the data and creating a copy of it to use
const { animals } = require('./data/animals');


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

//getting index.html to be served from our Express.js server
/// route points us to? It brings us to the root route of the server! 
//This is the route used to create a homepage for a server
app.get('/', (req, res) => {
  
  //this GET route has just one job to do, and that is to respond with an HTML page to display in the browser. So instead of using res.json(), we're using res.sendFile(), and all we have to do is tell them where to find the file we want our server to read and send back to the client
  res.sendFile(path.join(__dirname, './public/index.html'));
});

//route will take us to /animals
//a route that has the term api in it will deal in transference of JSON data, whereas a more normal-looking endpoint such as /animals should serve an HTML page.
app.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, './public/animals.html'));
});

//route will take us to /zookeepers
app.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, './public/zookeepers.html'));
});


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

  //function that accepts the POST route's req.body value and the array we want to add the data to
  //using the fs.writeFileSync() method, which is the synchronous version of fs.writeFile() and doesn't 
  //require a callback function.
  //We want to write to our animals.json file in the data subdirectory, 
  //so we use the method path.join() to join the value of __dirname, 
  //which represents the directory of the file we execute the code in, 
  //with the path to the animals.json file.
  //Next, we need to save the JavaScript array data as JSON, so we use 
  //JSON.stringify() to convert it.
  //The other two arguments used in the method, null and 2, are means 
  //of keeping our data formatted. The null argument means we don't 
  //want to edit any of our existing data; if we did, we could pass 
  //something in there. The 2 indicates we want to create white space 
  //between our values to make it more readable.
  function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);
    fs.writeFileSync(
      path.join(__dirname, './data/animals.json'),
      JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return animal;
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

  // new GET route for animals-we want to use params, which needs to be defined in a new route pather, so we need to make one
  //param route must come after get route
  app.get('/api/animals/:id', (req, res) => {
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
  app.post('/api/animals', (req, res) => {
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

  function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }

  // module.exports = {
  //   filterByQuery,
  //   findById,
  // };
  