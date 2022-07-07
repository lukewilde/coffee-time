const express = require('express');
const config = require('../../util/config');

const router = express.Router();

router.get('/', (req, res) => {
  res.send(`home page ${config.get('env')}`);
});

module.exports = router;
