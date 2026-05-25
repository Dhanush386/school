const FeedbackForm = require('../models/Feedback').FeedbackForm;
const FeedbackResponse = require('../models/Feedback').FeedbackResponse;
const Notification = require('../models/Notification');
const User = require('../models/User');

// ── @desc    Principal creates a feedback form
// ── @route   POST /api/feedback/forms
// ── @access  Principal, Admin
const createFeedbackForm = async (req, res) => {
  try {
    const {
      title,
      description,
      questions,
      targetRole,
      targetDepartment,
      startDate,
      endDate,
      isAnonymous,
    } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, message: 'title and at least one question are required' });
    }

    const form = await FeedbackForm.create({
      title: title.trim(),
      description: description?.trim(),
      questions,
      targetRole: targetRole || 'student',
      targetDepartment,
      startDate: startDate || new Date(),
      endDate,
      isAnonymous: isAnonymous !== false,
      createdBy: req.user.id,
      isActive: true,
    });

    // Notify target users
    const userFilter = { role: targetRole || 'student', isActive: true };
    if (targetDepartment) userFilter.department = targetDepartment;
    const targetUsers = await User.find(userFilter).select('_id');

    if (targetUsers.length > 0) {
      const notifications = targetUsers.map(u => ({
        recipient: u._id,
        sender: req.user.id,
        type: 'feedback_form_created',
        title: 'New Feedback Form',
        message: `A new feedback form "${form.title}" is now available. Please submit your response.`,
        relatedId: form._id,
        relatedModel: 'FeedbackForm',
      }));
      await Notification.insertMany(notifications);
    }

    return res.status(201).json({ success: true, message: 'Feedback form created', data: form });
  } catch (error) {
    console.error('createFeedbackForm error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Students see active feedback forms for their role
// ── @route   GET /api/feedback/forms/active
// ── @access  Student, Teacher
const getActiveForms = async (req, res) => {
  try {
    const now = new Date();
    const filter = {
      isActive: true,
      startDate: { $lte: now },
      $or: [{ endDate: { $gte: now } }, { endDate: null }],
      targetRole: req.user.role,
    };

    if (req.user.department) {
      filter.$or = [
        { targetDepartment: req.user.department },
        { targetDepartment: null },
        { targetDepartment: { $exists: false } },
      ];
    }

    const forms = await FeedbackForm.find(filter)
      .select('-questions.correctAnswer')
      .sort({ createdAt: -1 });

    // Check which ones current user has already submitted
    const submittedFormIds = await FeedbackResponse.distinct('form', { respondent: req.user.id });
    const submittedSet = new Set(submittedFormIds.map(id => id.toString()));

    const formsWithStatus = forms.map(form => ({
      ...form.toObject(),
      hasSubmitted: submittedSet.has(form._id.toString()),
    }));

    return res.status(200).json({ success: true, data: formsWithStatus, count: formsWithStatus.length });
  } catch (error) {
    console.error('getActiveForms error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student submits feedback responses
// ── @route   POST /api/feedback/forms/:id/submit
// ── @access  Student, Teacher
const submitFeedback = async (req, res) => {
  try {
    const { responses } = req.body;

    if (!responses || !Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({ success: false, message: 'Responses array is required' });
    }

    const form = await FeedbackForm.findById(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Feedback form not found' });

    if (!form.isActive) return res.status(400).json({ success: false, message: 'This feedback form is no longer active' });

    const now = new Date();
    if (form.endDate && now > new Date(form.endDate)) {
      return res.status(400).json({ success: false, message: 'The deadline for this feedback form has passed' });
    }

    // Check duplicate submission
    const alreadySubmitted = await FeedbackResponse.findOne({ form: form._id, respondent: req.user.id });
    if (alreadySubmitted) {
      return res.status(400).json({ success: false, message: 'You have already submitted feedback for this form' });
    }

    const feedbackResponse = await FeedbackResponse.create({
      form: form._id,
      respondent: req.user.id,
      responses,
      isAnonymous: form.isAnonymous,
      submittedAt: new Date(),
    });

    return res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedbackResponse });
  } catch (error) {
    console.error('submitFeedback error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Principal sees aggregated analytics for a form
// ── @route   GET /api/feedback/forms/:id/analytics
// ── @access  Principal, Admin
const getFeedbackAnalytics = async (req, res) => {
  try {
    const form = await FeedbackForm.findById(req.params.id);
    if (!form) return res.status(404).json({ success: false, message: 'Feedback form not found' });

    const responses = await FeedbackResponse.find({ form: form._id })
      .populate('respondent', 'name loginId department');

    const totalResponses = responses.length;

    // Aggregate answers per question
    const analytics = form.questions.map((question, qIndex) => {
      const questionResponses = responses.map(r => r.responses[qIndex]).filter(Boolean);

      if (question.type === 'rating' || question.type === 'scale') {
        const values = questionResponses.map(r => Number(r.answer)).filter(v => !isNaN(v));
        const average = values.length ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0;
        const distribution = {};
        values.forEach(v => { distribution[v] = (distribution[v] || 0) + 1; });
        return { questionIndex: qIndex, questionText: question.questionText, type: question.type, average: Number(average), distribution, count: values.length };
      }

      if (question.type === 'multiple-choice' || question.type === 'checkbox') {
        const distribution = {};
        questionResponses.forEach(r => {
          const ans = Array.isArray(r.answer) ? r.answer : [r.answer];
          ans.forEach(a => { distribution[a] = (distribution[a] || 0) + 1; });
        });
        return { questionIndex: qIndex, questionText: question.questionText, type: question.type, distribution, count: questionResponses.length };
      }

      // Text responses
      return {
        questionIndex: qIndex,
        questionText: question.questionText,
        type: question.type,
        answers: questionResponses.map(r => r.answer),
        count: questionResponses.length,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        form: { _id: form._id, title: form.title, targetRole: form.targetRole },
        totalResponses,
        analytics,
      },
    });
  } catch (error) {
    console.error('getFeedbackAnalytics error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Principal/Admin sees all forms
// ── @route   GET /api/feedback/forms
// ── @access  Principal, Admin
const getAllForms = async (req, res) => {
  try {
    const { isActive, targetRole, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (targetRole) filter.targetRole = targetRole;

    const total = await FeedbackForm.countDocuments(filter);
    const forms = await FeedbackForm.find(filter)
      .populate('createdBy', 'name loginId role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Attach response count to each form
    const formsWithCounts = await Promise.all(
      forms.map(async form => {
        const responseCount = await FeedbackResponse.countDocuments({ form: form._id });
        return { ...form.toObject(), responseCount };
      })
    );

    return res.status(200).json({
      success: true,
      data: formsWithCounts,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllForms error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  createFeedbackForm,
  getActiveForms,
  submitFeedback,
  getFeedbackAnalytics,
  getAllForms,
};

