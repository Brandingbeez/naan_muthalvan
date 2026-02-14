const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;
  res.status(statusCode).json({
    message,
    details,
    requestId: req.id,
  });
};

module.exports = { errorHandler };