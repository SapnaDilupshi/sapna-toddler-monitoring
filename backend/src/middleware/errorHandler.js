function errorHandler(err, req, res, next) {
  let status = err.status || 500;

  if (err.name === 'CastError' || err.name === 'ValidationError') {
    status = 400;
  }

  if (err.code === 11000) {
    status = 409;
  }

  if (status >= 500) {
    console.error(err);
  }

  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message || 'Internal server error';

  res.status(status).json({
    error: {
      message,
      status
    }
  });
}

module.exports = { errorHandler };
