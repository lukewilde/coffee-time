const express = require('express');
// const logger = require('../util/logger');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('home page');
});

module.exports = router;
