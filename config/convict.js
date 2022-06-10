const convict = require('convict');

const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'production',
    nullable: false,
    env: 'NODE_ENV',
  },
  logLevel: {
    doc: 'The bunyan logging level.',
    format: ['fatal', 'error', 'warn', 'info', 'debug', 'trace'],
    default: 'info',
    nullable: false,
    env: 'LOG_LEVEL',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3000,
    nullable: false,
    env: 'PORT',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'mongo',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'coffee-time',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: 27017,
    },
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
