const express = require('express');
const coffee = require('./coffee');

const apiRouter = express.Router();

apiRouter.route('/coffee').get(coffee.getCoffee);

module.exports = apiRouter;
