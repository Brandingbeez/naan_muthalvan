class HttpError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

const createHttpError = (statusCode, message, details) => {
  return new HttpError(statusCode, message, details);
};

module.exports = { createHttpError };