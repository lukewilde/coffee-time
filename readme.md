# coffee-time

A tiny yet overengineered RESTful api to sample a few libraries.

## libraries used

* Express
* Bunyan
* Convict
* Mongoose
* Mocha / Chai / Supertest

## Overengineering

### Logging

I've setup rotating logs using Bunyan, configured with multiple logging levels and output streams.

Each inbound request has a child logger attached to it, any logs made using this will automatically record their request id.

Every request has their parameters and responses logged via express middleware.

A good starting point for APM integration.

`utils/logging.js`.

### Environment Variables

Convict provides a schema and access method for environment variables.

`utils/config.js`.

### Mongoose error reporting

All errors are forwarded to a custom error handler, which detects and formats all mongoose errors consistently.

`utils/mongoose-error-hander.js`.
