module.exports = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  req.logger.error('Unexpected Error', error);
  next(error);
};
