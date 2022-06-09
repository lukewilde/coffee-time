const request = require('supertest');
const { expect } = require('chai');

const app = require('../app');
const fixtures = require('./fixtures/post');

describe('POST users', () => {
  it('should save a new coffee with valid data', (done) => {
    request(app)
      .post('/coffee')
      .send(fixtures.normalCoffee)
      .expect(201)
      .then((res) => {
        expect(res.body.name).to.be.eql(fixtures.normalCoffee.name);
        expect(res.body.price).to.be.eql(fixtures.normalCoffee.price);
        done();
      })
      .catch((err) => done(err));
  });

  it("shouldn't accept a coffee name that already exists in the database", (done) => {
    before(() => {
      request(app).post('/coffee').send(fixtures.normalCoffee);
    });

    request(app)
      .post('/coffee')
      .send(fixtures.normalCoffee)
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql('Coffee already exists');
        done();
      })
      .catch((err) => done(err));
  });

  it('should require a price', (done) => {
    request(app)
      .post('/coffee')
      .send(fixtures.freeCoffee)
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql('Price is required');
        done();
      })
      .catch((err) => done(err));
  });

  it('should require a name', (done) => {
    request(app)
      .post('/coffee')
      .send(fixtures.anonymousCoffee)
      .expect(400)
      .then((res) => {
        expect(res.body.message).to.be.eql('Name is required');
        done();
      })
      .catch((err) => done(err));
  });
});
