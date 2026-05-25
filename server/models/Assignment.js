const mongoose = require('mongoose');

// ─── Sub-schema: student submission ──────────────────────────────────────────
const submissionSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required in submission'],
    },
    file: {
      type: String,
      trim: true,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    grade: {
      type: String,
      trim: true,
      default: null,
    },
    feedback: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { _id: true }
);

// ─── Main Assignment schema ───────────────────────────────────────────────────
const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Assignment title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
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
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    attachments: {
      type: [String],
      default: [],
    },
    submissions: {
      type: [submissionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Virtual: submission count ────────────────────────────────────────────────
assignmentSchema.virtual('submissionCount').get(function () {
  return this.submissions.length;
});

// ─── Virtual: is overdue ──────────────────────────────────────────────────────
assignmentSchema.virtual('isOverdue').get(function () {
  return new Date() > this.dueDate;
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
assignmentSchema.index({ teacherId: 1, className: 1 });
assignmentSchema.index({ className: 1, subject: 1 });
assignmentSchema.index({ dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);

module.exports = Assignment;
