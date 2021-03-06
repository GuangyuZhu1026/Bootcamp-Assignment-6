var path = require('path'),  
    express = require('express'), 
    mongoose = require('mongodb').MongoClient,
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    //***************************************************************************
    config = process.env['config'];
    listingsRouter = require('../routes/listings.server.routes'),
    getCoordinates = require('../controllers/coordinates.server.controller.js');

module.exports.init = function() {
  //connect to database
  mongoose.Promise = global.Promise;
  
  mongoose.connect(process.env.MONGOLAB_URI);

  //initialize app
  var app = express();

  //enable request logging for development debugging
  app.use(morgan('dev'));

  //body parsing middleware 
  app.use(bodyParser.json());

  /* serve static files */
  app.use('/', express.static(__dirname + '/../../client'));
  app.use('/public', express.static(__dirname + '/../../public'));

  /* use the listings router for requests to the api */
  app.use('/api/listings', listingsRouter);

  /* server wrapper around Google Maps API to get latitude + longitude coordinates from address */
  app.post('/api/coordinates', getCoordinates, function(req, res) {
    res.send(req.results);
  });

  /* go to homepage for all routes not specified */ 
  app.all('/*', function(req, res) {
    res.sendFile(path.resolve('client/index.html'));
  });

  return app;
};  