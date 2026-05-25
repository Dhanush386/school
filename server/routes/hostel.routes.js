const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  applyHostel,
  getMyHostelApplication,
  approveHostelApplication,
  rejectHostelApplication,
  applyHostelLeave,
  approveHostelLeave,
  getAllApplications,
} = require('../controllers/hostelController');

// All routes require authentication
router.use(protect);

// ════════════════════════════════════════════════════════
//  HOSTEL APPLICATION ROUTES
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/hostel/apply
 * @desc    Student applies for hostel accommodation
 * @access  Student
 */
router.post(
  '/apply',
  authorize('student'),
  applyHostel
);

/**
 * @route   GET /api/hostel/my-application
 * @desc    Student views their hostel application
 * @access  Student
 */
router.get(
  '/my-application',
  authorize('student'),
  getMyHostelApplication
);

/**
 * @route   GET /api/hostel/applications
 * @desc    Admin views all hostel applications (pass ?type=leave for leave requests)
 * @access  Admin, Principal
 */
router.get(
  '/applications',
  authorize('admin', 'principal'),
  getAllApplications
);

/**
 * @route   PATCH /api/hostel/:id/approve
 * @desc    Admin approves hostel application and allocates room
 * @access  Admin
 */
router.patch(
  '/:id/approve',
  authorize('admin', 'principal'),
  approveHostelApplication
);

/**
 * @route   PATCH /api/hostel/:id/reject
 * @desc    Admin rejects hostel application
 * @access  Admin
 */
router.patch(
  '/:id/reject',
  authorize('admin', 'principal'),
  rejectHostelApplication
);

// ════════════════════════════════════════════════════════
//  HOSTEL LEAVE ROUTES
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/hostel/leave
 * @desc    Student applies for hostel leave
 * @access  Student
 */
router.post(
  '/leave',
  authorize('student'),
  applyHostelLeave
);

/**
 * @route   PATCH /api/hostel/leave/:id/approve
 * @desc    Admin approves hostel leave request
 * @access  Admin, Principal
 */
router.patch(
  '/leave/:id/approve',
  authorize('admin', 'principal'),
  approveHostelLeave
);

module.exports = router;

