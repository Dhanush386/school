const express = require('express');
const router = express.Router();

const { login, changePassword, getMe, forgotPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validateLogin, validateChangePassword } = require('../validators/authValidator');

// ── Public Routes ─────────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user and return JWT
 * @access  Public
 */
router.post('/login', validateLogin, login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Reset password to loginId and force change on next login
 * @access  Public
 */
router.post('/forgot-password', forgotPassword);

// ── Protected Routes ──────────────────────────────────────────────────────────

/**
 * @route   POST /api/auth/change-password
 * @desc    Change current user's password
 * @access  Private
 */
router.post('/change-password', protect, validateChangePassword, changePassword);

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user's profile
 * @access  Private
 */
router.get('/me', protect, getMe);

module.exports = router;

