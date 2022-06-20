const request = require('supertest');
const { expect } = require('chai');

const app = require('../../../app');
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

  describe('Name', () => {
    it('should be required', (done) => {
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
  });

  describe('Price', () => {
    it('should be required', (done) => {
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

    it('should not accept negative values', (done) => {
      request(app)
        .post('/coffee')
        .send(fixtures.negativePriceCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.be.eql('Negatigve prices are invalid');
          done();
        })
        .catch((err) => done(err));
    });

    it('should not accept strings', (done) => {
      request(app)
        .post('/coffee')
        .send(fixtures.stringPriceCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.be.eql('Price should be a number');
          done();
        })
        .catch((err) => done(err));
    });

    it('should not cast strings to numbers', (done) => {
      request(app)
        .post('/coffee')
        .send(fixtures.duckTypePriceCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.message).to.be.eql('Price should be a number');
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Date Created', () => {
    it('should have a default value', (done) => {
      request(app)
        .post('/coffee')
        .send(fixtures.normalCoffee)
        .expect(201)
        .then((res) => {
          expect(res.body.dateCreated).to.be.a(Date);
          done();
        })
        .catch((err) => done(err));
    });

    it('should default to todays date', (done) => {
      request(app)
        .post('/coffee')
        .send(fixtures.normalCoffee)
        .expect(201)
        .then((res) => {
          const nowDate = new Date().toDateString();
          expect(res.body.dateCreated.toDateString()).to.equal(nowDate);
          done();
        })
        .catch((err) => done(err));
    });
  });
});
