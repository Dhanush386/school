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
  try {
    const User = require('../models/User');
    const bcrypt = require('bcryptjs');
    const cashierExists = await User.findOne({ loginId: 'CASHIER001' });
    if (cashierExists) {
      return res.json({ success: true, message: 'Cashier already exists!' });
    }
    const hashedPassword = await bcrypt.hash('password123', 10);
    const cashier = await User.create({
      name: 'Frank Cashier',
      loginId: 'CASHIER001',
      password: hashedPassword,
      role: 'cashier',
      department: 'Finance',
      mustChangePassword: false,
      isActive: true,
    });
    res.json({ success: true, message: 'Cashier seeded successfully!', data: cashier });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Temporary debug route
router.get('/debug-fees/:loginId', async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ loginId: new RegExp(req.params.loginId, 'i') });
    if (!user) {
      return res.json({ error: 'User not found' });
    }
    const feesByStudentId = await require('../models/Fees').find({ studentId: user._id }).lean();
    const feesByStudent = await require('../models/Fees').find({ student: user._id }).lean();
    const allFees = await require('../models/Fees').find().limit(5).lean();
    
    res.json({
      user,
      feesByStudentId,
      feesByStudent,
      allFeesSample: allFees
    });
  } catch (err) {
    res.json({ error: err.message });
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

