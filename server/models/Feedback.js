const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// Sub-schema: question item inside a FeedbackForm
// ─────────────────────────────────────────────────────────────────────────────
const feedbackQuestionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['rating', 'text', 'multiple_choice'],
        message: 'Question type must be one of: rating, text, multiple_choice',
      },
      required: [true, 'Question type is required'],
    },
    options: {
      type: [String],
      default: [], // used when type === 'multiple_choice'
    },
  },
  { _id: true }
);

// ─────────────────────────────────────────────────────────────────────────────
// Schema 1: FeedbackForm
// ─────────────────────────────────────────────────────────────────────────────
const feedbackFormSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Feedback form title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
    },
    questions: {
      type: [feedbackQuestionSchema],
      default: [],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    targetRole: {
      type: String,
      enum: {
        values: ['student', 'teacher', 'all'],
        message: 'Target role must be one of: student, teacher, all',
      },
      default: 'all',
    },
    dueDate: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

feedbackFormSchema.index({ isActive: 1, targetRole: 1 });
feedbackFormSchema.index({ createdBy: 1 });

const FeedbackForm = mongoose.model('FeedbackForm', feedbackFormSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Sub-schema: individual answer in a FeedbackResponse
// ─────────────────────────────────────────────────────────────────────────────
const answerSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: [true, 'Question index is required'],
      min: [0, 'Question index must be non-negative'],
    },
    answer: {
      type: String,
      trim: true,
      default: '',
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10'],
      default: null,
    },
  },
  { _id: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// Schema 2: FeedbackResponse
// ─────────────────────────────────────────────────────────────────────────────
const feedbackResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeedbackForm',
      required: [true, 'Form ID is required'],
    },
    respondentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Respondent ID is required'],
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate responses from the same user for the same form
feedbackResponseSchema.index({ formId: 1, respondentId: 1 }, { unique: true });
feedbackResponseSchema.index({ formId: 1 });

const FeedbackResponse = mongoose.model('FeedbackResponse', feedbackResponseSchema);

// ─────────────────────────────────────────────────────────────────────────────
module.exports = { FeedbackForm, FeedbackResponse };
