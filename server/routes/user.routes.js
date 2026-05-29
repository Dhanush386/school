const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { createStudent, getStudents, deleteStudent } = require('../controllers/userController');

// TEMPORARY: Clean up fake users (Alice, Bob, etc.)
router.get('/clean-fake-users', async (req, res) => {
  try {
    const User = require('../models/User');
    const Fee = require('../models/Fees');
    const Notification = require('../models/Notification');

    const fakeUsers = await User.find({ role: { $nin: ['admin', 'cashier'] } });
    const fakeUserIds = fakeUsers.map(u => u._id);

    await Fee.deleteMany({
      $or: [{ student: { $in: fakeUserIds } }, { studentId: { $in: fakeUserIds } }]
    });
    await Notification.deleteMany({ recipient: { $in: fakeUserIds } });
    const deletedUsers = await User.deleteMany({ _id: { $in: fakeUserIds } });

    res.json({ success: true, message: `Deleted ${deletedUsers.deletedCount} fake users and their fees!` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

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

// ── @desc    Delete a user
// ── @route   DELETE /api/users/students/:id
// ── @access  Admin
router.delete('/students/:id', authorize('admin'), deleteStudent);

module.exports = router;
