const Complaint = require('../models/Complaint');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ── Helper: get admins/principals/coordinators ────────────────────────────────
const getReviewerIds = async () => {
  const reviewers = await User.find({
    role: { $in: ['admin', 'principal', 'coordinator'] },
    isActive: true,
  }).select('_id');
  return reviewers.map(r => r._id);
};

// ── @desc    Student creates a complaint/grievance
// ── @route   POST /api/complaints
// ── @access  Student, Teacher
const createComplaint = async (req, res) => {
  try {
    const { title, category, description, isAnonymous, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ success: false, message: 'Title and description are required' });
    }

    const complaint = await Complaint.create({
      student: req.user.id,
      title: title.trim(),
      category: category || 'general',
      description: description.trim(),
      isAnonymous: isAnonymous || false,
      priority: priority || 'medium',
      status: 'open',
    });

    // Notify reviewers
    const reviewerIds = await getReviewerIds();
    const senderName = isAnonymous ? 'Anonymous' : req.user.name;
    const notifications = reviewerIds.map(rid => ({
      recipient: rid,
      sender: req.user.id,
      type: 'complaint_created',
      title: 'New Complaint Submitted',
      message: `A new ${priority || 'medium'}-priority complaint has been submitted${isAnonymous ? ' anonymously' : ` by ${senderName}`}: "${title.trim()}"`,
      relatedId: complaint._id,
      relatedModel: 'Complaint',
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.status(201).json({ success: true, message: 'Complaint submitted successfully', data: complaint });
  } catch (error) {
    console.error('createComplaint error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student views their own complaints
// ── @route   GET /api/complaints/my
// ── @access  Student
const getMyComplaints = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { student: req.user.id };
    if (status) filter.status = status;

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('replies.repliedBy', 'name role loginId');

    return res.status(200).json({
      success: true,
      data: complaints,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getMyComplaints error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Principal/Admin/Coordinator views all complaints
// ── @route   GET /api/complaints
// ── @access  Admin, Principal, Coordinator
const getAllComplaints = async (req, res) => {
  try {
    const { status, category, priority, search, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Complaint.countDocuments(filter);
    const complaints = await Complaint.find(filter)
      .populate({
        path: 'student',
        select: 'name loginId department',
        // if anonymous, we still populate but frontend should hide
      })
      .populate('replies.repliedBy', 'name role loginId')
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Mask anonymous complaints
    const masked = complaints.map(c => {
      const obj = c.toObject();
      if (obj.isAnonymous) obj.student = { name: 'Anonymous', loginId: '***', department: '***' };
      return obj;
    });

    return res.status(200).json({
      success: true,
      data: masked,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllComplaints error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin/Principal replies to a complaint
// ── @route   POST /api/complaints/:id/reply
// ── @access  Admin, Principal, Coordinator
const replyComplaint = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || message.trim().length < 3) {
      return res.status(400).json({ success: false, message: 'Reply message (min 3 chars) is required' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (complaint.status === 'closed') {
      return res.status(400).json({ success: false, message: 'Cannot reply to a closed complaint' });
    }

    complaint.replies.push({
      repliedBy: req.user.id,
      message: message.trim(),
      repliedAt: new Date(),
    });

    if (complaint.status === 'open') complaint.status = 'in-progress';
    await complaint.save();

    // Notify student
    if (!complaint.isAnonymous) {
      await Notification.create({
        recipient: complaint.student,
        sender: req.user.id,
        type: 'complaint_replied',
        title: 'Reply to Your Complaint',
        message: `${req.user.name} replied to your complaint "${complaint.title}".`,
        relatedId: complaint._id,
        relatedModel: 'Complaint',
      });
    }

    return res.status(200).json({ success: true, message: 'Reply added', data: complaint });
  } catch (error) {
    console.error('replyComplaint error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Mark complaint as resolved
// ── @route   PATCH /api/complaints/:id/resolve
// ── @access  Admin, Principal, Coordinator
const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    if (complaint.status === 'resolved' || complaint.status === 'closed') {
      return res.status(400).json({ success: false, message: `Complaint is already ${complaint.status}` });
    }

    complaint.status = 'resolved';
    complaint.resolvedAt = new Date();
    complaint.resolvedBy = req.user.id;
    if (req.body.resolutionNote) {
      complaint.resolutionNote = req.body.resolutionNote.trim();
    }
    await complaint.save();

    if (!complaint.isAnonymous) {
      await Notification.create({
        recipient: complaint.student,
        sender: req.user.id,
        type: 'complaint_resolved',
        title: 'Complaint Resolved',
        message: `Your complaint "${complaint.title}" has been marked as resolved.`,
        relatedId: complaint._id,
        relatedModel: 'Complaint',
      });
    }

    return res.status(200).json({ success: true, message: 'Complaint resolved', data: complaint });
  } catch (error) {
    console.error('resolveComplaint error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Update complaint status
// ── @route   PATCH /api/complaints/:id/status
// ── @access  Admin, Principal, Coordinator
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['open', 'in-progress', 'resolved', 'closed', 'rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${validStatuses.join(', ')}` });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return res.status(404).json({ success: false, message: 'Complaint not found' });

    const prevStatus = complaint.status;
    complaint.status = status;
    if (status === 'resolved' && !complaint.resolvedAt) {
      complaint.resolvedAt = new Date();
      complaint.resolvedBy = req.user.id;
    }
    await complaint.save();

    if (!complaint.isAnonymous && prevStatus !== status) {
      await Notification.create({
        recipient: complaint.student,
        sender: req.user.id,
        type: 'complaint_status_updated',
        title: 'Complaint Status Updated',
        message: `Your complaint "${complaint.title}" status changed from ${prevStatus} to ${status}.`,
        relatedId: complaint._id,
        relatedModel: 'Complaint',
      });
    }

    return res.status(200).json({ success: true, message: 'Status updated', data: complaint });
  } catch (error) {
    console.error('updateStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  replyComplaint,
  resolveComplaint,
  updateStatus,
};

