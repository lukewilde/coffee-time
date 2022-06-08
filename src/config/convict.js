const convict = require('convict');

// Define a schema
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: null,
    nullable: false,
    env: 'NODE_ENV',
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: null,
    nullable: false,
    env: 'PORT',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'server1.dev.test',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'users',
    },
  },
});

// Perform validation
config.validate({ allowed: 'strict' });

module.exports = config;
