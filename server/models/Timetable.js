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
    timeSlots: {
      type: [String],
      default: ['08:30-09:30', '09:30-10:30', '10:30-11:30', '11:30-12:30', '01:30-02:30', '02:30-03:30', '03:30-04:30'],
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
