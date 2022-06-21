// const mongoose = require('mongoose');

const Coffee = require('../../../models/coffee');

function getCoffees(req, res) {
  Coffee.find({}).exec()
    .then((books) => res.json(books))
    .catch((error) => res.send(error));
}

function getCoffee(req, res) {
  Coffee.findById(req.params.id)
    .then((coffee) => res.json(coffee))
    .catch((error) => res.status(404).send(error));
}

function postCoffee(req, res) {
  new Coffee(req.body).save()
    .then((coffee) => res.status(201).json(coffee))
    .catch((error) => res.status(400).send(error));
}

module.exports = { getCoffee, getCoffees, postCoffee };
