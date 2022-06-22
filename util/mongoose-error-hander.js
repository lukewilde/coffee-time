function formatValidationErrors(error) {
  return Object.entries(error.errors).map(([key, value]) => ({
    field: key,
    message: value.message,
  }));
}

function isMongooseError(error) {
  const mongooseErrorNames = [
    'ValidationError',
    'CastError',
  ];

  return mongooseErrorNames.find((errorName) => errorName === error.name);
}

const mongoseErrorHandler = (error, req, res, next) => {
  if (res.headersSent || !isMongooseError(error)) {
    return next(error);
  }

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
