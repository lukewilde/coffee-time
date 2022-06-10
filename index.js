const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');
const logger = require('./util/logger');
const routes = require('./routes');
const config = require('./config/convict');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.logger = logger.child({ reqId: crypto.randomUUID() }, true);
  req.logger.info({ req });
  res.on('finish', () => req.logger.info({ res }));
  next();
});

const { host, port, name } = config.get('db');

MongoClient.connect(`mongodb://${host}:${port}/${name}`, (err, db) => {
  if (!err) {
    console.log('We are connected');
  }
});

app.use('/', routes);

module.exports = app;
