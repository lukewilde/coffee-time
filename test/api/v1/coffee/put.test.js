const request = require('supertest');
const { expect } = require('chai');
const app = require('../../../app');
const fixtures = require('./fixtures/put');
const CoffeeModel = require('../../../../models/coffee');

describe('UPDATE users', () => {
  let coffeeModel;

  beforeEach((done) => {
    CoffeeModel.deleteMany({}, done);
    coffeeModel = new CoffeeModel(fixtures.normalCoffee);
    coffeeModel.save(coffeeModel);
  });

  it('should respond with the updated model', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.name.eql(fixtures.updatedCoffee.name);
        done();
      })
      .catch((err) => done(err));
  });

  it('should update all attributes', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect('Content-Type', /json/)
      .expect(200)
      .then((res) => {
        res.body.should.be.a('object');
        res.body.name.eql(fixtures.name.name);
        res.body.description.eql(fixtures.description.name);
        res.body.countryOfOrigin.eql(fixtures.countryOfOrigin.name);
        res.body.price.eql(fixtures.price.name);
        done();
      })
      .catch((err) => done(err));
  });

  it('update the model persisted in the database', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(coffeeModel.updatedCoffee)
      .expect('Content-Type', /json/)
      .expect(200)
      .get(`/api/v1/coffee/${coffeeModel.id}`)
      .then((res) => {
        res.body.name.eql(fixtures.updatedCoffee.name);
        done();
      })
      .catch((err) => done(err));
  });

  it('should only update the model with matching id', (done) => {
    before((doneBefore) => {
      const coffees = [fixtures.normalCoffee, fixtures.secondCoffee, fixtures.thirdCoffee];
      const persistCoffees = coffees.map((coffee) => new CoffeeModel(coffee).save());
      Promise.all(persistCoffees).then(doneBefore).catch(doneBefore);
    });

    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.updatedCoffee)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(() => CoffeeModel.find({ _id: { $ne: coffeeModel.id } }).exec())
      .then((coffeeModels) => {
        coffeeModels.length.to.eql(2);
        coffeeModels.forEach((coffee) => {
          coffee.name.should.not.eql(fixtures.updatedCoffee.name);
        });
      })
      .catch((err) => done(err));
  });

  it('should return validation errors', (done) => {
    request(app)
      .put(`/api/v1/coffee/${coffeeModel.id}`)
      .send(fixtures.freeCoffeeFromNoWhere)
      .expect('Content-Type', /json/)
      .expect(400)
      .then((res) => {
        expect(res.body.summary).to.be.eql('Coffee validation failed: countryOfOrigin: Path `countryOfOrigin` is required., price: Path `price` is required.');
        expect(res.body.errors[0].field).to.be.eql('countryOfOrigin');
        expect(res.body.errors[0].message).to.be.eql('Path `countryOfOrigin` is required.');
        expect(res.body.errors[1].field).to.be.eql('price');
        expect(res.body.errors[1].message).to.be.eql('Path `price` is required.');
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
