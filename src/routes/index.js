const express = require('express');

const router = express.Router();

// Define the home page route
router.get('/', (req, res) => {
  res.send('home page');
});

module.exports = router;
