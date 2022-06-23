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
          .then(() => CoffeeModel.findById(coffeeModel.id).exec())
          .then((deletedCoffee) => expect(deletedCoffee).to.equal(null))
          .then(() => done())
        ).catch((error) => done(error));
    });

    it('shouldn\'t remove other coffees', (done) => {
      const coffeeFixtures = [fixtures.normalCoffee, fixtures.aCoffee, fixtures.bCoffee];
      const coffeeModels = [];
      const saveCoffees = coffeeFixtures.map((coffee) => {
        const model = new CoffeeModel(coffee);
        coffeeModels.push(model);
        return model.save();
      });

      Promise.all(saveCoffees).then(() => {
        request(app)
          .delete(`/api/v1/coffee/${coffeeModels[1].id}`)
          .expect(204)
          .then(() => CoffeeModel.findById(coffeeModels[0].id).exec())
          .then((undeletedCoffee) => expect(undeletedCoffee.name).to.equal(coffeeModels[0].name))
          .then(() => CoffeeModel.findById(coffeeModels[2].id).exec())
          .then((undeletedCoffee) => expect(undeletedCoffee.name).to.equal(coffeeModels[2].name))
          .then(() => done())
          .catch((error) => done(error));
      }).catch((error) => done(error));
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
