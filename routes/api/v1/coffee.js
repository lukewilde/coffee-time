// const mongoose = require('mongoose');

const Coffee = require('../../../models/coffee');

function getCoffee(req, res) {
  const query = Coffee.find({});
  query.exec((err, books) => {
    if (err) res.send(err);
    res.json(books);
  });
}

module.exports = { getCoffee };
