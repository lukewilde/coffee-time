const mongoose = require('mongoose');
const app = require('../index');

after((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.disconnect(() => {
      done();
    });
  });
});

mongoose.set('autoIndex', false);

module.exports = app;
