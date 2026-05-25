const mongoose = require('mongoose');

// ─────────────────────────────────────────────────────────────────────────────
// Schema 1: HostelApplication
// ─────────────────────────────────────────────────────────────────────────────
const hostelApplicationSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    roomType: {
      type: String,
      enum: {
        values: ['single', 'double', 'triple'],
        message: 'Room type must be one of: single, double, triple',
      },
      required: [true, 'Room type is required'],
    },
    preferredBlock: {
      type: String,
      trim: true,
      default: null,
    },
    reason: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be one of: pending, approved, rejected',
      },
      default: 'pending',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    allocatedRoom: {
      type: String,
      trim: true,
      default: null,
    },
    allocatedBlock: {
      type: String,
      trim: true,
      default: null,
    },
    allocatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

hostelApplicationSchema.index({ studentId: 1, status: 1 });
hostelApplicationSchema.index({ status: 1 });

const HostelApplication = mongoose.model('HostelApplication', hostelApplicationSchema);

// ─────────────────────────────────────────────────────────────────────────────
// Schema 2: HostelLeave
// ─────────────────────────────────────────────────────────────────────────────
const hostelLeaveSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
    },
    fromDate: {
      type: Date,
      required: [true, 'From date is required'],
    },
    toDate: {
      type: Date,
      required: [true, 'To date is required'],
      validate: {
        validator: function (value) {
          return value >= this.fromDate;
        },
        message: 'To date must be on or after from date',
      },
    },
    reason: {
      type: String,
      required: [true, 'Reason for leave is required'],
      trim: true,
    },
    destination: {
      type: String,
      trim: true,
      default: '',
    },
    parentContact: {
      type: String,
      trim: true,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'approved', 'rejected'],
        message: 'Status must be one of: pending, approved, rejected',
      },
      default: 'pending',
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

hostelLeaveSchema.index({ studentId: 1, status: 1 });
hostelLeaveSchema.index({ fromDate: 1, toDate: 1 });

const HostelLeave = mongoose.model('HostelLeave', hostelLeaveSchema);

// ─────────────────────────────────────────────────────────────────────────────
module.exports = { HostelApplication, HostelLeave };
