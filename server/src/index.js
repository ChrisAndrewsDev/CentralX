// Import modules
const express = require('express');
require('dotenv').config();
const morgan = require('morgan');
const { dbPing } = require('./config/db');

// Import custom modules
const ApiError = require('./utilities/ApiError');
const apiErrorHandler = require('./middleware/apiErrorHandler');

// Import development debug tool
const debugStartup = require('debug')('app:startup');

// General App configuration settings
const config = require('./config/config'); 

// Initialise application using express
const app = express();

// Import central routes
const routes = require('./routes/routes');

// EXPRESS MIDDLEWARE:
// (a) Returns middleware that only parses JSON/urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
debugStartup('Parsing middleware enabled on all routes');

// (b) Cycle our requests through morgan to track our queries
app.use(morgan('dev'));

// (c) Main routing middleware function
app.use('/api', routes());

// (d) Not Found Route
app.use((req, res, next) => {
  next(ApiError.notFound());
});

// (e) Error Handler Middleware
app.use(apiErrorHandler);

// (f) Ping DB & Set Port
dbPing.then(() => {
  app.listen(
    config.port, 
    () => console.log(`Server is running on port: ${config.port}`)
  );
});