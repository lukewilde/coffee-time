const bunyan = require('bunyan');
const bunyanformat = require('bunyan-format');
const config = require('./config');

const formatOut = bunyanformat({ outputMode: 'short' });

const logger = bunyan.createLogger({
  name: 'webserver',
  level: config.get('logLevel'),
  src: config.get('env') === 'development',
  serializers: bunyan.stdSerializers,
  streams: [
    { stream: formatOut },
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
