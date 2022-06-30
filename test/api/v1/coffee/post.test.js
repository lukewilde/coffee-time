const request = require('supertest');
const { expect } = require('chai');

const app = require('../../../app');
const fixtures = require('./fixtures/post');
const CoffeeModel = require('../../../../models/coffee');

describe('POST coffee', () => {
  beforeEach((done) => {
    CoffeeModel.deleteMany({}, done);
  });

  it('should save a new coffee with valid data', (done) => {
    request(app)
      .post('/api/v1/coffee')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
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
        .post('/api/v1/coffee')
        .send(fixtures.anonymousCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.errors[0].field).to.be.eql('name');
          expect(res.body.errors[0].message).to.be.eql('Path `name` is required.');
          done();
        })
        .catch((err) => done(err));
    });

    it("shouldn't accept a coffee name that already exists in the database", (done) => {
      new CoffeeModel(fixtures.normalCoffee).save()
        .then(() => request(app)
          .post('/api/v1/coffee')
          .send(fixtures.normalCoffee)
          .expect(400)
          .then((res) => {
            expect(res.body.errors[0].field).to.be.eql('name');
            expect(res.body.errors[0].message).to.be.eql('Error, expected `name` to be unique. Value: `Normal coffee`');
            done();
          }))
        .catch((err) => done(err));
    });
  });

  describe('Price', () => {
    it('should be required', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.freeCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.errors[0].field).to.be.eql('price');
          expect(res.body.errors[0].message).to.be.eql('Path `price` is required.');
          done();
        })
        .catch((err) => done(err));
    });

    it('should not accept negative values', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.negativePriceCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.errors[0].field).to.be.eql('price');
          expect(res.body.errors[0].message).to.be.eql('Path `price` (-3.5) is less than minimum allowed value (0).');
          done();
        })
        .catch((err) => done(err));
    });

    it('should not accept strings', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.stringPriceCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.errors[0].field).to.be.eql('price');
          expect(res.body.errors[0].message).to.be.eql('Cast to Number failed for value "tree fiddy" (type string) at path "price"');
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Country code', () => {
    it('should be required', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.unknownLocationCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.errors[0].field).to.be.eql('countryOfOrigin');
          expect(res.body.errors[0].message).to.be.eql('Path `countryOfOrigin` is required.');
          done();
        })
        .catch((err) => done(err));
    });

    it('should only accept ISO 3166-1 alpha-2 codes', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.alienCoffee)
        .expect(400)
        .then((res) => {
          expect(res.body.errors[0].field).to.be.eql('countryOfOrigin');
          expect(res.body.errors[0].message).to.be.eql('Validator failed for path `countryOfOrigin` with value `N/A`');
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Date Created', () => {
    it('should default to todays date', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.normalCoffee)
        .expect(201)
        .then((res) => {
          const nowDate = new Date().toDateString();
          expect(new Date(res.body.dateCreated).toDateString()).to.equal(nowDate);
          done();
        })
        .catch((err) => done(err));
    });
  });

  describe('Multiple errors', () => {
    it('should be reported', (done) => {
      request(app)
        .post('/api/v1/coffee')
        .send(fixtures.freeCoffeeFromNoWhere)
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
  });
});
