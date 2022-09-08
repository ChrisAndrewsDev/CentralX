// CENTRAL ROUTE FILE
// Import express and router
const express = require('express'); 
const router = express.Router();

// Import sub-routes
// NOTE: As our application grows in complexity, the need for refactoring grows, as we want to keep our code as readable as possible despite growing scale.  We will segment our routes according to collection, to help for easier readibility.
const authRoutes = require('./authRoutes');

module.exports = () => {
  // [A] HOME: Test GET Route
  router.get('/', (req, res, next) => {
    res.send('Welcome to the CentralX API');
  });

  // [B] Sub-Routes
  router.use('/auth', authRoutes());

  return router
}