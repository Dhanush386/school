const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: [true, 'Class (department) is required'],
      trim: true,
    },
    section: {
      type: String,
      enum: ['A', 'B', 'C', 'D'],
      required: [true, 'Section is required'],
    },
    schedule: {
      Monday: [String],
      Tuesday: [String],
      Wednesday: [String],
      Thursday: [String],
      Friday: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one timetable exists per class and section
timetableSchema.index({ department: 1, section: 1 }, { unique: true });

module.exports = mongoose.model('Timetable', timetableSchema);
