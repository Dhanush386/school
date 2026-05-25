const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  getStudentFees,
  payFee,
  getFeeStructure,
  getAllFees,
  createFeeRecord,
  downloadReceipt,
} = require('../controllers/feesController');

// All routes require authentication
router.use(protect);

/**
 * @route   GET /api/fees/structure
 * @desc    Get fee breakdown/structure by type (admin analytics)
 * @access  Admin, Principal, Coordinator
 */
router.get(
  '/structure',
  authorize('admin', 'principal', 'coordinator'),
  getFeeStructure
);

/**
 * @route   GET /api/fees/my
 * @desc    Student gets their own fee records
 * @access  Student
 */
router.get(
  '/my',
  authorize('student'),
  getStudentFees
);

/**
 * @route   GET /api/fees
 * @desc    Admin gets all fees with filters
 * @access  Admin, Principal
 */
router.get(
  '/',
  authorize('admin', 'principal'),
  getAllFees
);

/**
 * @route   POST /api/fees
 * @desc    Admin creates a fee record for a student
 * @access  Admin
 */
router.post(
  '/',
  authorize('admin'),
  createFeeRecord
);

/**
 * @route   POST /api/fees/:id/pay
 * @desc    Pay a specific fee (student or admin)
 * @access  Student, Admin
 */
router.post(
  '/:id/pay',
  authorize('student', 'admin'),
  payFee
);

/**
 * @route   GET /api/fees/:id/receipt
 * @desc    Download PDF receipt for a paid fee
 * @access  Student (owner), Admin
 */
router.get(
  '/:id/receipt',
  authorize('student', 'admin', 'principal'),
  downloadReceipt
);

/**
 * @route   GET /api/fees/student/:studentId
 * @desc    Admin gets all fees for a specific student
 * @access  Admin, Principal
 */
router.get(
  '/student/:studentId',
  authorize('admin', 'principal'),
  getStudentFees
);

module.exports = router;

