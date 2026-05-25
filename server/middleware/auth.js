/**
 * middleware/auth.js
 * JWT authentication and role-based authorization middleware for School ERP.
 *
 * Usage:
 *   router.get('/protected', protect, handler);
 *   router.post('/admin-only', protect, authorize('admin', 'principal'), handler);
 */

const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// ---------------------------------------------------------------------------
// Lazy-load the User model to avoid circular dependency issues at startup.
// ---------------------------------------------------------------------------
const getUserModel = () => {
  // If the model has already been compiled, reuse it; otherwise require it.
  try {
    return mongoose.model('User');
  } catch {
    return require('../models/User');
  }
};

// ---------------------------------------------------------------------------
// protect
// Verifies the Bearer JWT sent in the Authorization header.
// On success, attaches the full user document to req.user and calls next().
// On failure, passes a structured Error to next() for the global error handler.
// ---------------------------------------------------------------------------
const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    const err = new Error('Not authorized – no token provided');
    err.statusCode = 401;
    return next(err);
  }

  try {
    // Verify signature and expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch fresh user data (ensures deactivated accounts are caught)
    const User = getUserModel();
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      const err = new Error('Not authorized – user no longer exists');
      err.statusCode = 401;
      return next(err);
    }

    req.user = user;
    next();
  } catch (error) {
    // JsonWebTokenError, TokenExpiredError, NotBeforeError, etc.
    const err = new Error('Not authorized – token is invalid or expired');
    err.statusCode = 401;
    return next(err);
  }
};

// ---------------------------------------------------------------------------
// authorize(...roles)
// Factory that returns a middleware checking req.user.role against the
// whitelist of allowed roles.  Must be used AFTER protect.
// ---------------------------------------------------------------------------
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      const err = new Error('Not authorized – authentication required');
      err.statusCode = 401;
      return next(err);
    }

    if (!roles.includes(req.user.role)) {
      const err = new Error(
        `Forbidden – role '${req.user.role}' is not permitted to access this resource`
      );
      err.statusCode = 403;
      return next(err);
    }

    next();
  };
};

module.exports = { protect, authorize };
