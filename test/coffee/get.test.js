const request = require('supertest');
const { expect } = require('chai');

const app = require('../app');
// const fixtures = require('./fixtures/get');

describe('GET users', () => {
  it('should retrieve an empty array if there are no users', (done) => {
    request(app)
      .get('/coffee')
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.eql([]);
        done();
      })
      .catch((err) => done(err));
  });
});
