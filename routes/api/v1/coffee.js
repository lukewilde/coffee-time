// const mongoose = require('mongoose');

const Coffee = require('../../../models/coffee');

function getCoffees(req, res) {
  const query = Coffee.find({});
  query.exec((error, books) => {
    if (error) {
      res.send(error);
    }

    res.json(books);
  });
}

function getCoffee(req, res) {
  Coffee.findById(req.params.id, (error, coffee) => {
    if (error) {
      res.status(404).send(error);
    }

    res.json(coffee);
  });
}

function postCoffee(req, res) {
  const newCoffee = new Coffee(req.body);
  newCoffee.save((error, coffee) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.status(201).json(coffee);
    }
  });
}

module.exports = { getCoffee, getCoffees, postCoffee };
