const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Fee = require('../models/Fees');
const User = require('../models/User');
const Notification = require('../models/Notification');
const generateReceipt = require('../utils/generateReceipt');

// ── @desc    Get all fees for the logged-in student
// ── @route   GET /api/fees/my
// ── @access  Student
const getStudentFees = async (req, res) => {
  try {
    const studentId = req.user.role === 'student' ? req.user.id : req.params.studentId;

    const { status, academicYear, feeType } = req.query;
    const filter = { $or: [{ studentId: studentId }, { student: studentId }] };
    if (status) filter.status = status;
    if (academicYear) filter.academicYear = academicYear;
    if (feeType) filter.feeType = feeType;

    const fees = await Fee.find(filter)
      .populate('student', 'name loginId department')
      .sort({ dueDate: 1 });

    const totalAmount = fees.reduce((sum, f) => sum + f.amount, 0);
    const totalPaid = fees.filter(f => f.status === 'paid').reduce((sum, f) => sum + f.amount, 0);
    const totalPending = fees.filter(f => f.status !== 'paid').reduce((sum, f) => sum + f.amount, 0);

    return res.status(200).json({
      success: true,
      data: fees,
      summary: { totalAmount, totalPaid, totalPending, count: fees.length },
    });
  } catch (error) {
    console.error('getStudentFees error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Pay a fee (mark as paid, generate receipt)
// ── @route   POST /api/fees/:id/pay
// ── @access  Student / Admin
const payFee = async (req, res) => {
  try {
    const { paymentMethod = 'Online' } = req.body;

    const fee = await Fee.findById(req.params.id).populate('student', 'name loginId department');

    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });

    if (fee.status === 'paid') {
      return res.status(400).json({ success: false, message: 'This fee has already been paid' });
    }

    // Only student owner or admin can pay
    if (req.user.role === 'student' && fee.student._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const transactionId = `TXN${Date.now()}${uuidv4().split('-')[0].toUpperCase()}`;
    const paymentDate = new Date();

    // Generate receipt PDF
    const receiptFilename = await generateReceipt({
      studentName: fee.student.name,
      studentId: fee.student.loginId,
      department: fee.student.department,
      feeType: fee.feeType,
      amount: fee.amount,
      transactionId,
      paymentMethod,
      paymentDate,
    });

    fee.status = 'paid';
    fee.paymentDate = paymentDate;
    fee.paymentMethod = paymentMethod;
    fee.transactionId = transactionId;
    fee.receiptFilename = receiptFilename;
    await fee.save();

    // Notify student
    await Notification.create({
      recipient: fee.student._id,
      type: 'fee_paid',
      title: 'Fee Payment Successful',
      message: `Payment of ₹${fee.amount} for ${fee.feeType} was successful. Transaction ID: ${transactionId}`,
      relatedId: fee._id,
      relatedModel: 'Fee',
    });

    return res.status(200).json({
      success: true,
      message: 'Payment successful',
      data: {
        transactionId,
        amount: fee.amount,
        feeType: fee.feeType,
        paymentDate,
        receiptFilename,
      },
    });
  } catch (error) {
    console.error('payFee error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get fee structure / breakdown by type
// ── @route   GET /api/fees/structure
// ── @access  Private
const getFeeStructure = async (req, res) => {
  try {
    const { academicYear, department } = req.query;
    const match = {};
    if (academicYear) match.academicYear = academicYear;
    if (department) {
      const students = await User.find({ department, role: 'student' }).select('_id');
      match.$or = [{ studentId: { $in: students.map(s => s._id) } }, { student: { $in: students.map(s => s._id) } }];
    }

    const breakdown = await Fee.aggregate([
      { $match: match },
      {
        $group: {
          _id: '$feeType',
          totalAmount: { $sum: '$amount' },
          paidAmount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, '$amount', 0] } },
          count: { $sum: 1 },
          paidCount: { $sum: { $cond: [{ $eq: ['$status', 'paid'] }, 1, 0] } },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return res.status(200).json({ success: true, data: breakdown });
  } catch (error) {
    console.error('getFeeStructure error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin gets all fees with filters
// ── @route   GET /api/fees
// ── @access  Admin, Principal
const getAllFees = async (req, res) => {
  try {
    const { status, feeType, academicYear, search, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (feeType) filter.feeType = feeType;
    if (academicYear) filter.academicYear = academicYear;

    if (search) {
      const users = await User.find({
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { loginId: { $regex: search, $options: 'i' } },
        ],
        role: 'student',
      }).select('_id');
      filter.$or = [{ studentId: { $in: users.map(u => u._id) } }, { student: { $in: users.map(u => u._id) } }];
    }

    const total = await Fee.countDocuments(filter);
    const fees = await Fee.find(filter)
      .populate('student', 'name loginId department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: fees,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllFees error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin creates a fee record for a student
// ── @route   POST /api/fees
// ── @access  Admin
const createFeeRecord = async (req, res) => {
  try {
    const { student, feeType, amount, dueDate, academicYear, semester, description } = req.body;

    if (!student || !feeType || !amount || !dueDate) {
      return res.status(400).json({ success: false, message: 'student, feeType, amount and dueDate are required' });
    }

    const studentUser = await User.findById(student);
    if (!studentUser || studentUser.role !== 'student') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const fee = await Fee.create({
      studentId: student,
      feeType,
      amount,
      dueDate,
      academicYear,
      semester,
      description,
      status: 'pending',
      createdBy: req.user.id,
    });

    // Notify student
    await Notification.create({
      recipient: student,
      type: 'fee_created',
      title: 'New Fee Record',
      message: `A new fee record for ${feeType} of ₹${amount} has been created. Due: ${new Date(dueDate).toLocaleDateString('en-IN')}`,
      relatedId: fee._id,
      relatedModel: 'Fee',
    });

    return res.status(201).json({ success: true, message: 'Fee record created', data: fee });
  } catch (error) {
    console.error('createFeeRecord error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Download a fee receipt PDF
// ── @route   GET /api/fees/:id/receipt
// ── @access  Student (owner) / Admin
const downloadReceipt = async (req, res) => {
  try {
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ success: false, message: 'Fee record not found' });

    if (req.user.role === 'student' && fee.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (!fee.receiptFilename) {
      return res.status(404).json({ success: false, message: 'No receipt available for this fee' });
    }

    const receiptPath = path.join(__dirname, '..', 'uploads', 'receipts', fee.receiptFilename);
    return res.download(receiptPath, fee.receiptFilename, (err) => {
      if (err) {
        console.error('Receipt download error:', err);
        return res.status(500).json({ success: false, message: 'Could not download receipt' });
      }
    });
  } catch (error) {
    console.error('downloadReceipt error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getStudentFees,
  payFee,
  getFeeStructure,
  getAllFees,
  createFeeRecord,
  downloadReceipt,
};

