const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const fixtures = require('./fixtures/put');
const CoffeeModel = require('../../../../models/coffee');

describe('UPDATE coffee', () => {
  let coffeeModel;

  beforeEach((done) => {
    CoffeeModel.deleteMany({})
      .then(() => {
        coffeeModel = new CoffeeModel(fixtures.normalCoffee);
        return coffeeModel.save();
      })
      .then(() => done())
      .catch((error) => done(error));
  });

  it('should respond with the updated model', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.a('object');
        expect(res.body.name).eql(fixtures.updatedCoffee.name);
        done();
      })
      .catch((err) => done(err));
  });

  it('should update all attributes', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.a('object');
        expect(res.body.name).eql(fixtures.updatedCoffee.name);
        expect(res.body.description).eql(fixtures.updatedCoffee.description);
        expect(res.body.countryOfOrigin).eql(fixtures.updatedCoffee.countryOfOrigin);
        expect(res.body.price).eql(fixtures.updatedCoffee.price);
        done();
      })
      .catch((err) => done(err));
  });

  it('update the model persisted in the database', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect(200)
      .expect((res) => {
        expect(res.body).to.be.an('object');
        expect(res.body.name).eql(fixtures.updatedCoffee.name);
      })
      .then(() => CoffeeModel.findById(coffeeModel.id))
      .then((coffee) => {
        expect(coffee.name).eql(fixtures.updatedCoffee.name);
        done();
      })
      .catch((err) => done(err));
  });

  it('should only update the model with matching id', (done) => {
    const coffees = [fixtures.secondCoffee, fixtures.thirdCoffee];
    const persistCoffees = coffees.map((coffee) => new CoffeeModel(coffee).save());

    Promise.all(persistCoffees).then(() => request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => CoffeeModel.find({ _id: { $ne: coffeeModel.id } }))
      .then((coffeeModels) => {
        expect(coffeeModels.length).to.eql(2);
        coffeeModels.forEach((coffee) => {
          expect(coffee.name).to.not.eql(fixtures.updatedCoffee.name);
        });
        done();
      }))
      .catch((err) => done(err));
  });

  it('should return validation errors', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.freeCoffeeFromWrongPlace)
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.summary).to.be.eql('Coffee validation failed: price: Path `price` (-1) is less than minimum allowed value (0)., countryOfOrigin: Validator failed for path `countryOfOrigin` with value `down town`');
        expect(res.body.errors[0].field).to.be.eql('price');
        expect(res.body.errors[0].message).to.be.eql('Path `price` (-1) is less than minimum allowed value (0).');
        expect(res.body.errors[1].field).to.be.eql('countryOfOrigin');
        expect(res.body.errors[1].message).to.be.eql('Validator failed for path `countryOfOrigin` with value `down town`');
        done();
      })
      .catch((err) => done(err));
  });

  it('should throw 404 if an invalid id is used', (done) => {
    request(app)
      .put(`/api/v1/coffee/${fixtures.unknownCoffeeId}`)
      .send(fixtures.updatedCoffee)
      .then(() => done())
      .catch((err) => done(err));
  });
});
