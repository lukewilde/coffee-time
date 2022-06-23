// const mongoose = require('mongoose');

const Coffee = require('../../../models/coffee');

function getCoffees(req, res, next) {
  Coffee.find({}).exec()
    .then((coffees) => res.json(coffees))
    .catch((error) => next(error));
}

function getCoffee(req, res, next) {
  Coffee.findById(req.params.id)
    .then((coffee) => {
      if (!coffee) return res.status(404).send();
      res.json(coffee);
    })
    .catch((error) => next(error));
}

function postCoffee(req, res, next) {
  new Coffee(req.body).save()
    .then((coffee) => res.status(201).json(coffee))
    .catch((error) => next(error));
}

function deleteCoffee(req, res, next) {
  Coffee.deleteOne({ _id: req.params.id })
    .then((result) => {
      if (result.deletedCount !== 1) return res.sendStatus(404);
      res.sendStatus(204);
    })
    .catch((error) => next(error));
}

module.exports = {
  getCoffee, getCoffees, postCoffee, deleteCoffee,
};
