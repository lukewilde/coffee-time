const express = require('express');
const log4js = require('log4js');
const bodyParser = require('body-parser');
const routes = require('./routes');

const log = log4js.getLogger();
const app = express();

app.use(log4js.connectLogger(log4js.getLogger('http'), { level: 'auto' }));
app.use(bodyParser.json());

log.info('Adding routes');
app.use('/', routes);

module.exports = app;
