const mongoose = require('mongoose');
const app = require('../index');

before(() => {
  // Setup database connection.
});

afterEach(() => {
  // Remove all database documents.
});

after((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.disconnect(() => {
      done();
    });
  });
});

module.exports = app;
