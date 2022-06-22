// const mongoose = require('mongoose');

const Coffee = require('../../../models/coffee');

function getCoffees(req, res, next) {
  Coffee.find({}).exec()
    .then((books) => res.json(books))
    .catch((error) => next(error));
}

function getCoffee(req, res, next) {
  Coffee.findById(req.params.id)
    .then((coffee) => {
      if (coffee) {
        res.json(coffee);
      } else {
        res.status(404).send();
      }
    })
    .catch((error) => next(error));
}

function postCoffee(req, res, next) {
  new Coffee(req.body).save()
    .then((coffee) => res.status(201).json(coffee))
    .catch((error) => next(error));
}

module.exports = { getCoffee, getCoffees, postCoffee };
