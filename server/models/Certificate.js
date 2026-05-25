const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    type: {
      type: String,
      enum: {
        values: ['bonafide', 'transfer', 'completion', 'character', 'migration'],
        message: 'Certificate type must be one of: bonafide, transfer, completion, character, migration',
      },
      required: [true, 'Certificate type is required'],
    },
    purpose: {
      type: String,
      required: [true, 'Purpose is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected', 'ready'],
        message: 'Status must be one of: pending, approved, rejected, ready',
      },
      default: 'pending',
    },
    adminRemarks: {
      type: String,
      trim: true,
      default: '',
    },
    generatedFile: {
      type: String, // filename/path of the generated certificate PDF
      trim: true,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save: set approvedAt when status changes to approved or ready ────────
certificateSchema.pre('save', function (next) {
  if (
    this.isModified('status') &&
    (this.status === 'approved' || this.status === 'ready') &&
    !this.approvedAt
  ) {
    this.approvedAt = new Date();
  }
  next();
});

// ─── Indexes ──────────────────────────────────────────────────────────────────
certificateSchema.index({ studentId: 1, status: 1 });
certificateSchema.index({ studentId: 1, type: 1 });
certificateSchema.index({ status: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);

module.exports = Certificate;
