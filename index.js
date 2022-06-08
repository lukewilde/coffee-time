const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const logger = require('./util/logger');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.logger = logger.child({ reqId: crypto.randomUUID() }, true);
  req.logger.info({ req });
  res.on('finish', () => req.logger.info({ res }));
  next();
});

app.use('/', routes);

module.exports = app;
