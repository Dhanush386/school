const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');

// ── Question Bank Controllers ─────────────────────────────────────────────────
const {
  createQuestion,
  submitQuestion,
  getMyQuestions,
  getAllQuestions,
  approveQuestion,
  rejectQuestion,
  getQuestionById,
  updateQuestion,
} = require('../controllers/questionController');

// ── Attendance Controllers ────────────────────────────────────────────────────
const {
  markAttendance,
  getStudentAttendance,
  getClassAttendance,
  getAttendanceReport,
  updateAttendance,
} = require('../controllers/attendanceController');

const { validateQuestion } = require('../validators/questionValidator');

// ── All routes below require authentication ───────────────────────────────────
router.use(protect);

// ════════════════════════════════════════════════════════
//  QUESTION BANK ROUTES  (/api/academic/questions/...)
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/academic/questions
 * @desc    Teacher creates a question bank (draft)
 * @access  Teacher
 */
router.post(
  '/questions',
  authorize('teacher'),
  validateQuestion,
  createQuestion
);

/**
 * @route   GET /api/academic/questions/my
 * @desc    Teacher views their own question banks
 * @access  Teacher
 */
router.get(
  '/questions/my',
  authorize('teacher'),
  getMyQuestions
);

/**
 * @route   GET /api/academic/questions
 * @desc    Principal/Admin views all question banks
 * @access  Principal, Admin, Coordinator
 */
router.get(
  '/questions',
  authorize('principal', 'admin', 'coordinator'),
  getAllQuestions
);

/**
 * @route   GET /api/academic/questions/:id
 * @desc    Get a single question bank by ID
 * @access  Teacher (owner) | Principal | Admin | Coordinator
 */
router.get('/questions/:id', getQuestionById);

/**
 * @route   PUT /api/academic/questions/:id
 * @desc    Teacher updates a draft/rejected question bank
 * @access  Teacher
 */
router.put(
  '/questions/:id',
  authorize('teacher'),
  updateQuestion
);

/**
 * @route   PATCH /api/academic/questions/:id/submit
 * @desc    Teacher submits a question bank for approval
 * @access  Teacher
 */
router.patch(
  '/questions/:id/submit',
  authorize('teacher'),
  submitQuestion
);

/**
 * @route   PATCH /api/academic/questions/:id/approve
 * @desc    Principal/Admin approves a question bank
 * @access  Principal, Admin
 */
router.patch(
  '/questions/:id/approve',
  authorize('principal', 'admin'),
  approveQuestion
);

/**
 * @route   PATCH /api/academic/questions/:id/reject
 * @desc    Principal/Admin rejects a question bank
 * @access  Principal, Admin
 */
router.patch(
  '/questions/:id/reject',
  authorize('principal', 'admin'),
  rejectQuestion
);

// ════════════════════════════════════════════════════════
//  ATTENDANCE ROUTES  (/api/academic/attendance/...)
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/academic/attendance
 * @desc    Teacher marks attendance for a class
 * @access  Teacher, Admin
 */
router.post(
  '/attendance',
  authorize('teacher', 'admin'),
  markAttendance
);

/**
 * @route   GET /api/academic/attendance/my
 * @desc    Student views their own attendance
 * @access  Student
 */
router.get(
  '/attendance/my',
  authorize('student'),
  getStudentAttendance
);

/**
 * @route   GET /api/academic/attendance/class
 * @desc    Teacher/Admin views class attendance
 * @access  Teacher, Admin, Principal
 */
router.get(
  '/attendance/class',
  authorize('teacher', 'admin', 'principal', 'coordinator'),
  getClassAttendance
);

/**
 * @route   GET /api/academic/attendance/report
 * @desc    Get attendance report with monthly/weekly breakdown
 * @access  Teacher, Admin, Principal
 */
router.get(
  '/attendance/report',
  authorize('teacher', 'admin', 'principal', 'coordinator'),
  getAttendanceReport
);

/**
 * @route   PUT /api/academic/attendance/:id
 * @desc    Teacher corrects an attendance record
 * @access  Teacher, Admin
 */
router.put(
  '/attendance/:id',
  authorize('teacher', 'admin'),
  updateAttendance
);

module.exports = router;

