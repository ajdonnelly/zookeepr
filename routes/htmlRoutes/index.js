//General: we're using apiRoutes/index.js as a central hub for all routing functions we may want to add to the application. 

// router.use(require('./zookeeperRoutes'));

const path = require('path');
//start an instance of Router:
const router = require('express').Router();

// const animalRoutes = require('../apiRoutes/animalRoutes');

//getting index.html to be served from our Express.js server
/// route points us to? It brings us to the root route of the server! 
//This is the route used to create a homepage for a server
router.get('/', (req, res) => {
  
  //this GET route has just one job to do, and that is to respond with an HTML page to display in the browser. So instead of using res.json(), we're using res.sendFile(), and all we have to do is tell them where to find the file we want our server to read and send back to the client
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

//route will take us to /animals
//a route that has the term api in it will deal in transference of JSON data, whereas a more normal-looking endpoint such as /animals should serve an HTML page.
router.get('/animals', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/animals.html'));
});

//route will take us to /zookeepers
router.get('/zookeepers', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/zookeepers.html'));
});

module.exports  = router;