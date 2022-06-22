const logger = require('./logger');

function formatValidationErrors(error) {
  return Object.entries(error.errors).map(([key, value]) => ({
    field: key,
    message: value.message,
  }));
}

const mongoseErrorHandler = (error, req, res, next) => {
  if (!error.errors && !error.name) {
    return next();
  }

  logger.error('Mongoose error handler:', error);

  // return res.send(error);
  let prettyErrors;

  if (error.name === 'CastError') {
    prettyErrors = { message: error.message };
  } else {
    prettyErrors = {
      summary: error.message,
      errors: formatValidationErrors(error),
    };
  }

  return res.status(400).send(prettyErrors);
};

module.exports = mongoseErrorHandler;
