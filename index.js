const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');
const logger = require('./util/logger');
const frontEndRoutes = require('./routes/front-end');
const apiV1Routes = require('./routes/api/v1');
const config = require('./config/convict');

const { host, port, name } = config.get('db');

async function main() {
  await mongoose.connect(`mongodb://${host}:${port}/${name}`);
}

main().catch((error) => logger.error(error));

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  req.logger = logger.child({ reqId: crypto.randomUUID() }, true);
  req.logger.info({ req });
  res.on('finish', () => req.logger.info({ res }));
  next();
});

app.use('/', frontEndRoutes);
app.use('/api/v1', apiV1Routes);

app.use((err, req, res, next) => {

  // TODO: log errors & format mongoose errors?
});

module.exports = app;
