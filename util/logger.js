const bunyan = require('bunyan');
const bunyanDebugStream = require('bunyan-debug-stream');
const config = require('../config/convict');

const logger = bunyan.createLogger({
  name: 'coffee-time',
  level: config.get('logLevel'),
  src: config.get('env') === 'development',
  serializers: bunyanDebugStream.serializers,
  streams: [
    {
      stream: bunyanDebugStream.create({
        basepath: __dirname,
        forceColor: true,
        showDate: (time) => time.split('T')[1].split('.')[0],
      }),
    },
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
