const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ── @desc    Get all students
// ── @route   GET /api/users/students
// ── @access  Admin, Cashier
const getStudents = async (req, res) => {
  try {
    const { search, department, role, limit = 50, page = 1 } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    else filter.role = { $in: ['student', 'teacher'] };
    
    if (department) filter.department = department;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { loginId: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const students = await User.find(filter)
      .select('-password -__v')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: students,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getStudents error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Create a new user (Student or Teacher)
// ── @route   POST /api/users/students (keeping route name for now)
// ── @access  Admin
const createStudent = async (req, res) => {
  try {
    const { name, loginId, department, role, section } = req.body;

    if (!name || !loginId || !department) {
      return res.status(400).json({ success: false, message: 'Name, loginId (Roll No), and department are required' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ loginId: loginId.trim().toUpperCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'A user with this Login ID / Roll No already exists' });
    }

    const student = await User.create({
      name,
      loginId: loginId.trim().toUpperCase(),
      password: 'password123',
      role: role || 'student',
      department,
      section: section || 'A',
      mustChangePassword: true,
      isActive: true,
    });

    // Remove password from response
    student.password = undefined;

    return res.status(201).json({
      success: true,
      message: 'Student created successfully. Default password is: password123',
      data: student,
    });
  } catch (error) {
    console.error('createStudent error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Delete a user
// ── @route   DELETE /api/users/students/:id
// ── @access  Admin
const deleteStudent = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Do not allow deleting admins or cashiers via this route just in case
    if (user.role === 'admin' || user.role === 'cashier') {
      return res.status(403).json({ success: false, message: 'Cannot delete admin or cashier accounts here' });
    }

    // Delete associated fees and notifications (cleanup)
    const Fee = require('../models/Fees');
    const Notification = require('../models/Notification');
    await Fee.deleteMany({ $or: [{ studentId: user._id }, { student: user._id }] });
    await Notification.deleteMany({ recipient: user._id });

    await user.deleteOne();

    return res.status(200).json({ success: true, message: 'User and their records deleted successfully' });
  } catch (error) {
    console.error('deleteStudent error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudents,
  createStudent,
  deleteStudent,
};
