const mongoose = require('mongoose');

// ─── Sub-schema: individual question item ────────────────────────────────────
const questionItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: {
        values: ['mcq', 'descriptive', 'true_false'],
        message: 'Question type must be one of: mcq, descriptive, true_false',
      },
      required: [true, 'Question type is required'],
    },
    text: {
      type: String,
      required: [true, 'Question text is required'],
      trim: true,
    },
    options: {
      type: [String],
      default: [],
    },
    correctAnswer: {
      type: String,
      trim: true,
      default: '',
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required for each question'],
      min: [0, 'Marks cannot be negative'],
    },
  },
  { _id: true }
);

// ─── Main Question (Question Paper) schema ────────────────────────────────────
const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Question paper title is required'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    className: {
      type: String,
      required: [true, 'Class name is required'],
      trim: true,
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Teacher ID is required'],
    },
    questions: {
      type: [questionItemSchema],
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr);
        },
        message: 'Questions must be an array',
      },
    },
    pdfFile: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'pending', 'approved', 'rejected'],
        message: 'Status must be one of: draft, pending, approved, rejected',
      },
      default: 'draft',
    },
    principalComment: {
      type: String,
      trim: true,
      default: '',
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual: total marks ─────────────────────────────────────────────────────
questionSchema.virtual('totalMarks').get(function () {
  return this.questions.reduce((sum, q) => sum + (q.marks || 0), 0);
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
questionSchema.index({ teacherId: 1, status: 1 });
questionSchema.index({ department: 1, className: 1, subject: 1 });
questionSchema.index({ status: 1 });

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
