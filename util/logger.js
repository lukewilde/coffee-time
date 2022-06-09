const bunyan = require('bunyan');
const config = require('../config/convict');

const logger = bunyan.createLogger({
  name: 'coffee-time',
  level: config.get('logLevel'),
  src: config.get('env') === 'development',
  serializers: bunyan.stdSerializers,
  streams: [
    { stream: process.stdout },
    {
      type: 'rotating-file',
      path: '/var/log/coffee-time/debug.log',
      period: '1d',
      count: 3,
    },
  ],
});

logger.info(`Log level set to '${config.get('logLevel')}'`);

module.exports = logger;
