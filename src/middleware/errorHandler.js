const status = require('../utils/status')

function errorHandler (err, req, res, next) {
  // Default error
  const error = {
    status: status.HTTP_500_INTERNAL_SERVER_ERROR,
    error: 'Internal Server Error',
    message: err.message || 'Something went wrong'
  }

  // Log error
  if (req.app && req.app.logger) {
    req.app.logger.error(err.message)
  } else {
    console.error(err.message)
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.status = status.HTTP_400_BAD_REQUEST
    error.error = 'Bad Request'
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.status = status.HTTP_401_UNAUTHORIZED
    error.error = 'Unauthorized'
  }

  // Cast errors (MongoDB)
  if (err.name === 'CastError') {
    error.status = status.HTTP_400_BAD_REQUEST
    error.error = 'Bad Request'
    error.message = 'Invalid ID format'
  }

  // Duplicate key errors
  if (err.code === 11000) {
    error.status = status.HTTP_409_CONFLICT
    error.error = 'Conflict'
    error.message = 'Resource already exists'
  }

  res.status(error.status).json(error)
}

module.exports = errorHandler
