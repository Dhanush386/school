/**
 * middleware/errorHandler.js
 * Global Express error-handling middleware for School ERP.
 *
 * Handles:
 *  - Mongoose ValidationError
 *  - Mongoose CastError  (invalid ObjectId)
 *  - Mongoose duplicate-key error  (code 11000)
 *  - JsonWebTokenError / TokenExpiredError
 *  - Generic application errors (with optional statusCode)
 *
 * Must be registered LAST in server.js:
 *   app.use(errorHandler);
 */

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // -------------------------------------------------------------------------
  // Defaults
  // -------------------------------------------------------------------------
  let statusCode = err.statusCode || 500;
  let message    = err.message    || 'Internal Server Error';
  let errors     = null; // extra field for validation details

  // -------------------------------------------------------------------------
  // 1. Mongoose – CastError (e.g. invalid ObjectId format)
  // -------------------------------------------------------------------------
  if (err.name === 'CastError') {
    statusCode = 400;
    message    = `Invalid value for field '${err.path}': '${err.value}'`;
  }

  // -------------------------------------------------------------------------
  // 2. Mongoose – ValidationError (schema validators failed)
  // -------------------------------------------------------------------------
  else if (err.name === 'ValidationError') {
    statusCode = 422;
    message    = 'Validation failed';
    // Collect all individual field messages
    errors = Object.values(err.errors).map((e) => ({
      field:   e.path,
      message: e.message,
    }));
  }

  // -------------------------------------------------------------------------
  // 3. MongoDB – Duplicate key (unique constraint violation)
  // -------------------------------------------------------------------------
  else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    message = `Duplicate value: '${value}' already exists for '${field}'`;
  }

  // -------------------------------------------------------------------------
  // 4. JWT – Invalid token signature
  // -------------------------------------------------------------------------
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message    = 'Invalid token – please log in again';
  }

  // -------------------------------------------------------------------------
  // 5. JWT – Token has expired
  // -------------------------------------------------------------------------
  else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message    = 'Token has expired – please log in again';
  }

  // -------------------------------------------------------------------------
  // Development: include the stack trace for easier debugging
  // -------------------------------------------------------------------------
  const response = {
    success: false,
    statusCode,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  // Log server-side for observability
  if (statusCode >= 500) {
    console.error('🔴 [ErrorHandler]', err);
  } else {
    console.warn(`🟡 [ErrorHandler] ${statusCode} – ${message}`);
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
