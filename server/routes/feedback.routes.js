const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  createFeedbackForm,
  getActiveForms,
  submitFeedback,
  getFeedbackAnalytics,
  getAllForms,
} = require('../controllers/feedbackController');

// All routes require authentication
router.use(protect);

// ════════════════════════════════════════════════════════
//  FEEDBACK FORM MANAGEMENT (Principal / Admin)
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/feedback/forms
 * @desc    Principal/Admin creates a new feedback form
 * @access  Principal, Admin
 */
router.post(
  '/forms',
  authorize('principal', 'admin'),
  createFeedbackForm
);

/**
 * @route   GET /api/feedback/forms
 * @desc    Principal/Admin sees all feedback forms with response counts
 * @access  Principal, Admin
 */
router.get(
  '/forms',
  authorize('principal', 'admin'),
  getAllForms
);

/**
 * @route   GET /api/feedback/forms/:id/analytics
 * @desc    Principal/Admin views aggregated analytics for a form
 * @access  Principal, Admin
 */
router.get(
  '/forms/:id/analytics',
  authorize('principal', 'admin'),
  getFeedbackAnalytics
);

// ════════════════════════════════════════════════════════
//  FEEDBACK FORM PARTICIPATION (Students / Teachers)
// ════════════════════════════════════════════════════════

/**
 * @route   GET /api/feedback/forms/active
 * @desc    Students/Teachers see active feedback forms available to them
 * @access  Student, Teacher
 */
router.get(
  '/forms/active',
  authorize('student', 'teacher'),
  getActiveForms
);

/**
 * @route   POST /api/feedback/forms/:id/submit
 * @desc    Student/Teacher submits feedback responses for a form
 * @access  Student, Teacher
 */
router.post(
  '/forms/:id/submit',
  authorize('student', 'teacher'),
  submitFeedback
);

module.exports = router;

