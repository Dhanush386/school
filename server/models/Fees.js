const mongoose = require('mongoose');

const feesSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    feeType: {
      type: String,
      required: [true, 'Fee type is required'],
      trim: true,
      // e.g. 'tuition', 'hostel', 'transport', 'library', 'exam', etc.
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0, 'Amount cannot be negative'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'overdue'],
        message: 'Status must be one of: pending, paid, overdue',
      },
      default: 'pending',
    },
    transactionId: {
      type: String,
      trim: true,
      default: null,
      index: { sparse: true },
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['upi', 'card', 'netbanking', 'qr', 'cash'],
        message: 'Payment method must be one of: upi, card, netbanking, qr, cash',
      },
      default: null,
    },
    receiptNumber: {
      type: String,
      trim: true,
      default: null,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
      trim: true,
      // e.g. '2024-25'
      match: [/^\d{4}-\d{2}$/, 'Academic year must be in format YYYY-YY (e.g. 2024-25)'],
    },
    semester: {
      type: Number,
      min: [1, 'Semester must be at least 1'],
      max: [8, 'Semester cannot exceed 8'],
      default: null,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save: auto-mark overdue ──────────────────────────────────────────────
feesSchema.pre('save', function (next) {
  if (this.status === 'pending' && this.dueDate && new Date() > this.dueDate) {
    this.status = 'overdue';
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
feesSchema.index({ status: 1 });
feesSchema.index({ dueDate: 1 });

// Virtual for 'student' to support .populate('student')
feesSchema.virtual('student', {
  ref: 'User',
  localField: 'studentId',
  foreignField: '_id',
  justOne: true
});

feesSchema.set('toObject', { virtuals: true });
feesSchema.set('toJSON', { virtuals: true });

// Compound indexes
feesSchema.index({ studentId: 1, academicYear: 1, semester: 1 });
feesSchema.index({ studentId: 1, status: 1 });
feesSchema.index({ status: 1, dueDate: 1 });

const Fees = mongoose.model('Fees', feesSchema);

module.exports = Fees;
