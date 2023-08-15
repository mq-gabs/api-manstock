const AppError = require('./AppError');

const errorHandling = (
  error,
  request,
  response,
  next,
) => {
  console.log({ error });

  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      message: error.message
    });
  }

  return response.status(500).json({
    message: 'Internal server error'
  });
}

module.exports = errorHandling;