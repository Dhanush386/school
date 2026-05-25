const HostelApplication = require('../models/Hostel').HostelApplication;
const HostelLeave = require('../models/Hostel').HostelLeave;
const Notification = require('../models/Notification');
const User = require('../models/User');

// ── Helper: get admins ────────────────────────────────────────────────────────
const getAdminIds = async () => {
  const admins = await User.find({ role: { $in: ['admin', 'principal'] }, isActive: true }).select('_id');
  return admins.map(a => a._id);
};

// ── @desc    Student applies for hostel accommodation
// ── @route   POST /api/hostel/apply
// ── @access  Student
const applyHostel = async (req, res) => {
  try {
    const existing = await HostelApplication.findOne({ student: req.user.id, status: { $in: ['pending', 'approved'] } });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existing.status} hostel application.`,
      });
    }

    const {
      preferredRoom,
      foodPreference,
      emergencyContactName,
      emergencyContactPhone,
      emergencyContactRelation,
      medicalConditions,
      remarks,
      academicYear,
    } = req.body;

    const application = await HostelApplication.create({
      student: req.user.id,
      preferredRoom,
      foodPreference,
      emergencyContact: {
        name: emergencyContactName,
        phone: emergencyContactPhone,
        relation: emergencyContactRelation,
      },
      medicalConditions,
      remarks,
      academicYear,
      status: 'pending',
    });

    const adminIds = await getAdminIds();
    const notifications = adminIds.map(aid => ({
      recipient: aid,
      sender: req.user.id,
      type: 'hostel_applied',
      title: 'New Hostel Application',
      message: `${req.user.name} has submitted a hostel application.`,
      relatedId: application._id,
      relatedModel: 'HostelApplication',
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.status(201).json({ success: true, message: 'Hostel application submitted', data: application });
  } catch (error) {
    console.error('applyHostel error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student views their hostel application
// ── @route   GET /api/hostel/my-application
// ── @access  Student
const getMyHostelApplication = async (req, res) => {
  try {
    const application = await HostelApplication.findOne({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('student', 'name loginId department')
      .populate('reviewedBy', 'name loginId role');

    if (!application) {
      return res.status(404).json({ success: false, message: 'No hostel application found' });
    }

    return res.status(200).json({ success: true, data: application });
  } catch (error) {
    console.error('getMyHostelApplication error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin approves hostel application and allocates room
// ── @route   PATCH /api/hostel/:id/approve
// ── @access  Admin
const approveHostelApplication = async (req, res) => {
  try {
    const { roomNumber, blockName, floorNumber, remarks } = req.body;

    if (!roomNumber || !blockName) {
      return res.status(400).json({ success: false, message: 'roomNumber and blockName are required to approve' });
    }

    const application = await HostelApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application is already ${application.status}` });
    }

    application.status = 'approved';
    application.roomNumber = roomNumber;
    application.blockName = blockName;
    application.floorNumber = floorNumber;
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    application.adminRemarks = remarks || '';
    await application.save();

    await Notification.create({
      recipient: application.student,
      sender: req.user.id,
      type: 'hostel_approved',
      title: 'Hostel Application Approved',
      message: `Your hostel application has been approved. Room: ${blockName}-${roomNumber}${floorNumber ? `, Floor: ${floorNumber}` : ''}.`,
      relatedId: application._id,
      relatedModel: 'HostelApplication',
    });

    return res.status(200).json({ success: true, message: 'Hostel application approved', data: application });
  } catch (error) {
    console.error('approveHostelApplication error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin rejects hostel application
// ── @route   PATCH /api/hostel/:id/reject
// ── @access  Admin
const rejectHostelApplication = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Rejection reason (min 5 chars) is required' });
    }

    const application = await HostelApplication.findById(req.params.id);
    if (!application) return res.status(404).json({ success: false, message: 'Application not found' });

    if (application.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Application is already ${application.status}` });
    }

    application.status = 'rejected';
    application.reviewedBy = req.user.id;
    application.reviewedAt = new Date();
    application.adminRemarks = reason.trim();
    await application.save();

    await Notification.create({
      recipient: application.student,
      sender: req.user.id,
      type: 'hostel_rejected',
      title: 'Hostel Application Rejected',
      message: `Your hostel application was rejected. Reason: ${reason.trim()}`,
      relatedId: application._id,
      relatedModel: 'HostelApplication',
    });

    return res.status(200).json({ success: true, message: 'Hostel application rejected', data: application });
  } catch (error) {
    console.error('rejectHostelApplication error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student applies for hostel leave
// ── @route   POST /api/hostel/leave
// ── @access  Student
const applyHostelLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, destinationAddress, contactDuringLeave } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({ success: false, message: 'fromDate, toDate and reason are required' });
    }

    if (new Date(toDate) < new Date(fromDate)) {
      return res.status(400).json({ success: false, message: 'toDate must be after fromDate' });
    }

    // Must have an approved hostel application
    const hostelApp = await HostelApplication.findOne({ student: req.user.id, status: 'approved' });
    if (!hostelApp) {
      return res.status(400).json({ success: false, message: 'You must have an approved hostel placement to apply for leave' });
    }

    const leave = await HostelLeave.create({
      student: req.user.id,
      hostelApplication: hostelApp._id,
      fromDate,
      toDate,
      reason,
      destinationAddress,
      contactDuringLeave,
      status: 'pending',
    });

    const adminIds = await getAdminIds();
    const notifications = adminIds.map(aid => ({
      recipient: aid,
      sender: req.user.id,
      type: 'hostel_leave_applied',
      title: 'Hostel Leave Request',
      message: `${req.user.name} has requested hostel leave from ${new Date(fromDate).toLocaleDateString('en-IN')} to ${new Date(toDate).toLocaleDateString('en-IN')}.`,
      relatedId: leave._id,
      relatedModel: 'HostelLeave',
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.status(201).json({ success: true, message: 'Leave application submitted', data: leave });
  } catch (error) {
    console.error('applyHostelLeave error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin approves hostel leave
// ── @route   PATCH /api/hostel/leave/:id/approve
// ── @access  Admin
const approveHostelLeave = async (req, res) => {
  try {
    const leave = await HostelLeave.findById(req.params.id);
    if (!leave) return res.status(404).json({ success: false, message: 'Leave request not found' });

    if (leave.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Leave is already ${leave.status}` });
    }

    leave.status = 'approved';
    leave.reviewedBy = req.user.id;
    leave.reviewedAt = new Date();
    leave.adminRemarks = req.body.remarks || '';
    await leave.save();

    await Notification.create({
      recipient: leave.student,
      sender: req.user.id,
      type: 'hostel_leave_approved',
      title: 'Hostel Leave Approved',
      message: `Your hostel leave from ${new Date(leave.fromDate).toLocaleDateString('en-IN')} to ${new Date(leave.toDate).toLocaleDateString('en-IN')} has been approved.`,
      relatedId: leave._id,
      relatedModel: 'HostelLeave',
    });

    return res.status(200).json({ success: true, message: 'Leave approved', data: leave });
  } catch (error) {
    console.error('approveHostelLeave error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin views all hostel applications
// ── @route   GET /api/hostel/applications
// ── @access  Admin, Principal
const getAllApplications = async (req, res) => {
  try {
    const { status, page = 1, limit = 15, search, type = 'application' } = req.query;

    if (type === 'leave') {
      const filter = {};
      if (status) filter.status = status;

      if (search) {
        const users = await User.find({
          $or: [{ name: { $regex: search, $options: 'i' } }, { loginId: { $regex: search, $options: 'i' } }],
          role: 'student',
        }).select('_id');
        filter.student = { $in: users.map(u => u._id) };
      }

      const total = await HostelLeave.countDocuments(filter);
      const leaves = await HostelLeave.find(filter)
        .populate('student', 'name loginId department')
        .populate('reviewedBy', 'name loginId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return res.status(200).json({
        success: true,
        data: leaves,
        pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
      });
    }

    const filter = {};
    if (status) filter.status = status;

    if (search) {
      const users = await User.find({
        $or: [{ name: { $regex: search, $options: 'i' } }, { loginId: { $regex: search, $options: 'i' } }],
        role: 'student',
      }).select('_id');
      filter.student = { $in: users.map(u => u._id) };
    }

    const total = await HostelApplication.countDocuments(filter);
    const applications = await HostelApplication.find(filter)
      .populate('student', 'name loginId department')
      .populate('reviewedBy', 'name loginId role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: applications,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllApplications error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  applyHostel,
  getMyHostelApplication,
  approveHostelApplication,
  rejectHostelApplication,
  applyHostelLeave,
  approveHostelLeave,
  getAllApplications,
};

