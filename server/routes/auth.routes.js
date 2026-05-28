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

// TEMPORARY: Seed Cashier User
router.get('/seed-cashier', async (req, res) => {
  const User = require('../models/User');
  try {
    // Check if exists
    const exists = await User.findOne({ loginId: 'CASHIER001' });
    if (exists) return res.json({ success: true, message: 'Cashier already exists' });
    
    const user = await User.create({
      name: 'Frank Cashier',
      loginId: 'CASHIER001',
      role: 'cashier',
      department: 'Finance',
      mustChangePassword: false,
      isActive: true,
      password: 'password123',
    });
    res.json({ success: true, message: 'Cashier seeded successfully!', user });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

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

