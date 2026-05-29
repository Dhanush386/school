const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createStudent, getStudents } = require('../controllers/userController');

// All routes require authentication
router.use(protect);

// ── @desc    Get all students
// ── @route   GET /api/users/students
// ── @access  Admin, Cashier
router.get('/students', authorize('admin', 'cashier'), getStudents);

// ── @desc    Create a new student
// ── @route   POST /api/users/students
// ── @access  Admin
router.post('/students', authorize('admin'), createStudent);

module.exports = router;
