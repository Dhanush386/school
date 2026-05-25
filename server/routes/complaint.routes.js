const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  replyComplaint,
  resolveComplaint,
  updateStatus,
} = require('../controllers/complaintController');

// All routes require authentication
router.use(protect);

// ════════════════════════════════════════════════════════
//  STUDENT / TEACHER COMPLAINT SUBMISSION
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/complaints
 * @desc    Student/Teacher submits a complaint or grievance
 * @access  Student, Teacher
 */
router.post(
  '/',
  authorize('student', 'teacher'),
  createComplaint
);

/**
 * @route   GET /api/complaints/my
 * @desc    Student/Teacher views their own complaints
 * @access  Student, Teacher
 */
router.get(
  '/my',
  authorize('student', 'teacher'),
  getMyComplaints
);

// ════════════════════════════════════════════════════════
//  ADMIN / PRINCIPAL / COORDINATOR COMPLAINT MANAGEMENT
// ════════════════════════════════════════════════════════

/**
 * @route   GET /api/complaints
 * @desc    Admin/Principal/Coordinator views all complaints with filters
 * @access  Admin, Principal, Coordinator
 */
router.get(
  '/',
  authorize('admin', 'principal', 'coordinator'),
  getAllComplaints
);

/**
 * @route   POST /api/complaints/:id/reply
 * @desc    Admin/Principal replies to a complaint
 * @access  Admin, Principal, Coordinator
 */
router.post(
  '/:id/reply',
  authorize('admin', 'principal', 'coordinator'),
  replyComplaint
);

/**
 * @route   PATCH /api/complaints/:id/resolve
 * @desc    Mark a complaint as resolved
 * @access  Admin, Principal, Coordinator
 */
router.patch(
  '/:id/resolve',
  authorize('admin', 'principal', 'coordinator'),
  resolveComplaint
);

/**
 * @route   PATCH /api/complaints/:id/status
 * @desc    Update complaint status (open/in-progress/resolved/closed/rejected)
 * @access  Admin, Principal, Coordinator
 */
router.patch(
  '/:id/status',
  authorize('admin', 'principal', 'coordinator'),
  updateStatus
);

/**
 * @route   GET /api/complaints/:id
 * @desc    Get single complaint details
 * @access  Admin, Principal, Coordinator, or owner
 */
router.get('/:id', async (req, res) => {
  try {
    const Complaint = require('../models/Complaint');
    const complaint = await Complaint.findById(req.params.id)
      .populate('student', 'name loginId department')
      .populate('replies.repliedBy', 'name role loginId')
      .populate('resolvedBy', 'name role loginId');

    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    const isOwner = complaint.student?._id?.toString() === req.user.id;
    const isReviewer = ['admin', 'principal', 'coordinator'].includes(req.user.role);

    if (!isOwner && !isReviewer) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const data = complaint.toObject();
    if (data.isAnonymous && !isReviewer) {
      // Owner seeing their own anonymous complaint: show it, but mask identity for safety
    } else if (data.isAnonymous && isReviewer) {
      data.student = { name: 'Anonymous', loginId: '***', department: '***' };
    }

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
});

module.exports = router;

