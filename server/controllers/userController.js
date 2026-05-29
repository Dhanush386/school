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

    // Hash default password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const student = await User.create({
      name,
      loginId: loginId.trim().toUpperCase(),
      password: hashedPassword,
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

module.exports = {
  getStudents,
  createStudent,
};
