const express = require('express');
const coffee = require('./coffee');

const apiRouter = express.Router();

const throw404 = (req, res) => {
  res.status(404).send();
};

apiRouter.route('/coffee').get(coffee.getCoffees);
apiRouter.route('/coffee/:id').get(coffee.getCoffee);
apiRouter.route('/coffee').post(coffee.postCoffee);
apiRouter.route('/coffee/:id').put(coffee.updateCoffee);
apiRouter.route('/coffee/:id').delete(coffee.deleteCoffee);
apiRouter.route('/coffee').delete(throw404);

module.exports = apiRouter;
