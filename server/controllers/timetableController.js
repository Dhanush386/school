const Timetable = require('../models/Timetable');

// ── @desc    Get timetable for a specific class and section
// ── @route   GET /api/timetable
// ── @access  Private
const getTimetable = async (req, res) => {
  try {
    const { department, section } = req.query;
    
    if (!department || !section) {
      return res.status(400).json({ success: false, message: 'Class (department) and Section are required' });
    }

    const timetable = await Timetable.findOne({ department, section });
    
    if (!timetable) {
      return res.status(404).json({ success: false, message: 'Timetable not found for this class and section' });
    }

    res.status(200).json({ success: true, data: timetable });
  } catch (error) {
    console.error('getTimetable error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Create or update timetable for a specific class and section
// ── @route   POST /api/timetable
// ── @access  Admin
const saveTimetable = async (req, res) => {
  try {
    const { department, section, schedule } = req.body;

    if (!department || !section || !schedule) {
      return res.status(400).json({ success: false, message: 'Class (department), Section, and schedule are required' });
    }

    // Upsert timetable
    const timetable = await Timetable.findOneAndUpdate(
      { department, section },
      { schedule },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json({ success: true, message: 'Timetable saved successfully', data: timetable });
  } catch (error) {
    console.error('saveTimetable error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getTimetable,
  saveTimetable,
};
