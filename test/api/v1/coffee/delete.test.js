const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const fixtures = require('./fixtures/delete');
const CoffeeModel = require('../../../../models/coffee');

describe('DELETE users', () => {
  beforeEach((done) => {
    CoffeeModel.deleteMany({}, done);
  });

  describe('No params', () => {
    it('should 404 if called without a coffee id', (done) => {
      request(app)
        .delete('/api/v1/coffee')
        .expect(404, done);
    });
  });

  describe(':id', () => {
    it('should remove a specific coffee when given it\'s id', (done) => {
      const coffeeModel = new CoffeeModel(fixtures.normalCoffee);
      coffeeModel.save()
        .then(() => request(app)
          .delete(`/api/v1/coffee/${coffeeModel.id}`)
          .expect(204)
          .then(() => CoffeeModel.findById(coffeeModel.id).exec().then((deletedCoffee) => {
            expect(deletedCoffee).to.equal(null);
            done();
          })))
        .catch((error) => done(error));
    });

    it('should 404 if none is found', (done) => {
      request(app)
        .delete(`/api/v1/coffee/${fixtures.unknownCoffeeId.id}`)
        .expect(404, done);
    });

    it('should 400 if if an invalid id is provided', (done) => {
      request(app)
        .delete('/api/v1/coffee/nothing')
        .expect(400, done);
    });
  });
});
