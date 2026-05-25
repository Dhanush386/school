const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Student ID is required'],
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
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['present', 'absent', 'late'],
        message: 'Status must be one of: present, absent, late',
      },
      required: [true, 'Attendance status is required'],
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Marked-by teacher ID is required'],
    },
  },
  {
    timestamps: true,
  }
);

// ─── Compound unique index: one record per student per subject per date ───────
attendanceSchema.index({ studentId: 1, subject: 1, date: 1 }, { unique: true });

// ─── Additional query indexes ─────────────────────────────────────────────────
attendanceSchema.index({ className: 1, date: 1 });
attendanceSchema.index({ markedBy: 1, date: 1 });
attendanceSchema.index({ studentId: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
