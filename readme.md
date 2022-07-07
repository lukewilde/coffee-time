# Coffee Time

A tiny yet overengineered RESTful api to sample a few libraries.

## libraries Used

* Express
* Bunyan
* Convict
* Mongoose
* Mocha / Chai / Supertest

## Overengineering

### Logging

I've setup rotating logs using Bunyan, configured with multiple logging levels and output streams.

Each inbound request has a child logger attached to it, any logs made using this will automatically record its request id.

Every request has its parameters and responses logged via express middleware.

A good starting point for APM integration.

`utils/logging.js`.

### Environment Variables

Convict provides a schema and access method for environment variables.

`utils/config.js`.

### Mongoose Error Reporting

All errors are forwarded to a custom error handler, which consistently detects and formats all mongoose errors.

`utils/mongoose-error-hander.js`.
