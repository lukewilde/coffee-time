// const mongoose = require('mongoose');

const Coffee = require('../../../models/coffee');

function getCoffee(req, res) {
  const query = Coffee.find({});
  query.exec((error, books) => {
    if (error) {
      res.send(error);
    } else {
      res.json(books);
    }
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

module.exports = { getCoffee, postCoffee };
