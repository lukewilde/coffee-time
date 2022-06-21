const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const fixtures = require('./fixtures/get');
const CoffeeModel = require('../../../../models/coffee');

describe('GET users', () => {
  beforeEach((done) => {
    CoffeeModel.deleteMany({}, done);
  });

  describe('No params', () => {
    it('should retrieve an empty array if there are no users', (done) => {
      request(app)
        .get('/api/v1/coffee')
        .expect(200)
        .then((res) => {
          expect(res.body).to.be.eql([]);
          done();
        })
        .catch((error) => done(error));
    });

    it('should return all coffees', (done) => {
      const coffees = [fixtures.normalCoffee, fixtures.secondCoffee, fixtures.thirdCoffee];
      const persistCoffees = coffees.map((coffee) => new CoffeeModel(coffee).save());

      Promise.all(persistCoffees)
        .then((savedCoffees) => request(app)
          .get('/api/v1/coffee/')
          .expect(200)
          .then((res) => {
            savedCoffees.forEach((coffee, i) => {
              expect(res.body[i].name).to.eql(coffee.name);
              expect(res.body[i].countryOfOrigin).to.eql(coffee.countryOfOrigin);
              expect(res.body[i].price).to.eql(coffee.price);
            });
            done();
          })).catch((error) => done(error));
    });
  });

  describe(':id', () => {
    it('should return a specific coffee if requested', (done) => {
      const coffeeModel = new CoffeeModel(fixtures.normalCoffee);
      coffeeModel.save()
        .then(() => request(app)
          .get(`/api/v1/coffee/${coffeeModel.id}`)
          .expect(200)
          .then((res) => {
            expect(res.body.name).to.eql('Normal coffee');
            expect(res.body.countryOfOrigin).to.eql('GB');
            expect(res.body.price).to.eql(3.51);
            done();
          })).catch((error) => done(error));
    });

    it('should 404 if none is found', (done) => {
      request(app)
        .get(`/api/v1/coffee/${fixtures.unknownCoffeeId}`)
        .expect(404)
        .then(() => {
          done();
        })
        .catch((error) => done(error));
    });

    it('should 400 if if an invalid id is provided', (done) => {
      request(app)
        .get('/api/v1/coffee/nothing')
        .expect(400)
        .then(() => {
          done();
        })
        .catch((error) => done(error));
    });
  });
});
