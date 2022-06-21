const express = require('express');
const coffee = require('./coffee');

const apiRouter = express.Router();

apiRouter.route('/coffee').get(coffee.getCoffees);
apiRouter.route('/coffee/:id').get(coffee.getCoffee);
apiRouter.route('/coffee').post(coffee.postCoffee);

module.exports = apiRouter;
