const bunyan = require('bunyan');
const config = require('../config/convict');

const logger = bunyan.createLogger({
  name: 'coffee-time',
  level: config.get('logLevel'),
  src: config.get('env') === 'development',
});

logger.info(`Setting log level to ${config.get('logLevel')}`);

module.exports = logger;
