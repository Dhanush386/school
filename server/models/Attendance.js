const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    session: {
      type: String,
      required: [true, 'Session is required'],
      enum: ['Morning', 'Evening'],
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
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked-by teacher ID is required'],
    },
    records: [
      {
        student: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        status: {
          type: String,
          enum: ['present', 'absent', 'late', 'excused'],
          default: 'present',
        },
        remarks: {
          type: String,
          default: '',
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// ─── Compound unique index: one record per class per session per date ───────
attendanceSchema.index({ className: 1, session: 1, date: 1 }, { unique: true });

// ─── Additional query indexes ─────────────────────────────────────────────────
attendanceSchema.index({ markedBy: 1, date: 1 });
attendanceSchema.index({ 'records.student': 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
