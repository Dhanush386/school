const QuestionBank = require('../models/Question');
const Notification = require('../models/Notification');
const User = require('../models/User');

// ── Helper: get principals/admins to notify ────────────────────────────────────
const getPrincipalIds = async () => {
  const principals = await User.find({ role: { $in: ['principal', 'admin'] }, isActive: true }).select('_id');
  return principals.map((p) => p._id);
};

// ── @desc    Teacher creates a question bank (draft)
// ── @route   POST /api/academic/questions
// ── @access  Teacher
const createQuestion = async (req, res) => {
  try {
    const body = req.validatedBody || req.body;

    const question = await QuestionBank.create({
      ...body,
      createdBy: req.user.id,
      status: 'draft',
    });

    return res.status(201).json({
      success: true,
      message: 'Question bank created as draft',
      data: question,
    });
  } catch (error) {
    console.error('createQuestion error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Teacher submits question bank for approval
// ── @route   PATCH /api/academic/questions/:id/submit
// ── @access  Teacher (owner)
const submitQuestion = async (req, res) => {
  try {
    const question = await QuestionBank.findById(req.params.id);

    if (!question) return res.status(404).json({ success: false, message: 'Question bank not found' });

    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only submit your own question banks' });
    }

    if (question.status !== 'draft' && question.status !== 'rejected') {
      return res.status(400).json({ success: false, message: `Cannot submit a question bank with status: ${question.status}` });
    }

    question.status = 'pending';
    question.submittedAt = new Date();
    await question.save();

    // Notify principals
    const principalIds = await getPrincipalIds();
    const notifications = principalIds.map((pid) => ({
      recipient: pid,
      sender: req.user.id,
      type: 'question_submitted',
      title: 'New Question Bank Submitted',
      message: `${req.user.name} submitted a question bank "${question.title}" for approval.`,
      relatedId: question._id,
      relatedModel: 'QuestionBank',
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.status(200).json({
      success: true,
      message: 'Question bank submitted for approval',
      data: question,
    });
  } catch (error) {
    console.error('submitQuestion error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Teacher views their own question banks
// ── @route   GET /api/academic/questions/my
// ── @access  Teacher
const getMyQuestions = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { createdBy: req.user.id };
    if (status) filter.status = status;

    const total = await QuestionBank.countDocuments(filter);
    const questions = await QuestionBank.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-questions'); // exclude full questions array for list view

    return res.status(200).json({
      success: true,
      data: questions,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getMyQuestions error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Principal/Admin sees all questions (pending/approved/all)
// ── @route   GET /api/academic/questions
// ── @access  Principal, Admin
const getAllQuestions = async (req, res) => {
  try {
    const { status, department, subject, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (department) filter.department = department;
    if (subject) filter.subject = subject;

    const total = await QuestionBank.countDocuments(filter);
    const questions = await QuestionBank.find(filter)
      .populate('createdBy', 'name loginId department')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .select('-questions');

    return res.status(200).json({
      success: true,
      data: questions,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllQuestions error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Principal approves a question bank
// ── @route   PATCH /api/academic/questions/:id/approve
// ── @access  Principal, Admin
const approveQuestion = async (req, res) => {
  try {
    const question = await QuestionBank.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question bank not found' });

    if (question.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending question banks can be approved' });
    }

    question.status = 'approved';
    question.reviewedBy = req.user.id;
    question.reviewedAt = new Date();
    question.reviewComment = req.body.comment || '';
    await question.save();

    // Notify teacher
    await Notification.create({
      recipient: question.createdBy,
      sender: req.user.id,
      type: 'question_approved',
      title: 'Question Bank Approved',
      message: `Your question bank "${question.title}" has been approved by ${req.user.name}.`,
      relatedId: question._id,
      relatedModel: 'QuestionBank',
    });

    return res.status(200).json({ success: true, message: 'Question bank approved', data: question });
  } catch (error) {
    console.error('approveQuestion error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Principal rejects a question bank with comment
// ── @route   PATCH /api/academic/questions/:id/reject
// ── @access  Principal, Admin
const rejectQuestion = async (req, res) => {
  try {
    const { comment } = req.body;
    if (!comment || comment.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'A rejection comment (min 5 chars) is required' });
    }

    const question = await QuestionBank.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question bank not found' });

    if (question.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending question banks can be rejected' });
    }

    question.status = 'rejected';
    question.reviewedBy = req.user.id;
    question.reviewedAt = new Date();
    question.reviewComment = comment.trim();
    await question.save();

    // Notify teacher
    await Notification.create({
      recipient: question.createdBy,
      sender: req.user.id,
      type: 'question_rejected',
      title: 'Question Bank Rejected',
      message: `Your question bank "${question.title}" was rejected. Reason: ${comment.trim()}`,
      relatedId: question._id,
      relatedModel: 'QuestionBank',
    });

    return res.status(200).json({ success: true, message: 'Question bank rejected', data: question });
  } catch (error) {
    console.error('rejectQuestion error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get single question bank by ID
// ── @route   GET /api/academic/questions/:id
// ── @access  Private (owner or principal/admin)
const getQuestionById = async (req, res) => {
  try {
    const question = await QuestionBank.findById(req.params.id)
      .populate('createdBy', 'name loginId department')
      .populate('reviewedBy', 'name loginId role');

    if (!question) return res.status(404).json({ success: false, message: 'Question bank not found' });

    const isOwner = question.createdBy._id.toString() === req.user.id;
    const isReviewer = ['principal', 'admin', 'coordinator'].includes(req.user.role);

    if (!isOwner && !isReviewer) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({ success: true, data: question });
  } catch (error) {
    console.error('getQuestionById error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Teacher updates a draft question bank
// ── @route   PUT /api/academic/questions/:id
// ── @access  Teacher (owner)
const updateQuestion = async (req, res) => {
  try {
    const question = await QuestionBank.findById(req.params.id);
    if (!question) return res.status(404).json({ success: false, message: 'Question bank not found' });

    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only edit your own question banks' });
    }

    if (question.status !== 'draft' && question.status !== 'rejected') {
      return res.status(400).json({ success: false, message: 'Only draft or rejected question banks can be edited' });
    }

    const allowedFields = ['title', 'subject', 'className', 'department', 'examType', 'totalMarks', 'duration', 'instructions', 'questions', 'tags', 'academicYear'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) question[field] = req.body[field];
    });

    // Reset status to draft if it was rejected
    if (question.status === 'rejected') question.status = 'draft';

    await question.save();

    return res.status(200).json({ success: true, message: 'Question bank updated', data: question });
  } catch (error) {
    console.error('updateQuestion error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createQuestion,
  submitQuestion,
  getMyQuestions,
  getAllQuestions,
  approveQuestion,
  rejectQuestion,
  getQuestionById,
  updateQuestion,
};

