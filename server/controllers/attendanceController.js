const Attendance = require('../models/Attendance');
const User = require('../models/User');

// ── @desc    Teacher marks attendance for their class
// ── @route   POST /api/academic/attendance
// ── @access  Teacher, Admin
const markAttendance = async (req, res) => {
  try {
    const { date, subject, className, department, records } = req.body;
    // records: [{ studentId, status }]  status: 'present' | 'absent' | 'late' | 'excused'

    if (!date || !subject || !className || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'date, subject, className and records are required' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check for duplicate
    const duplicate = await Attendance.findOne({
      date: attendanceDate,
      subject,
      className,
      markedBy: req.user.id,
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'Attendance for this class/subject/date has already been marked. Use update instead.',
        existingId: duplicate._id,
      });
    }

    // Validate students
    const studentIds = records.map(r => r.studentId);
    const validStudents = await User.find({ _id: { $in: studentIds }, role: 'student' }).select('_id');
    const validSet = new Set(validStudents.map(s => s._id.toString()));

    const attendanceRecords = records
      .filter(r => validSet.has(r.studentId.toString()))
      .map(r => ({
        student: r.studentId,
        status: r.status || 'present',
        remarks: r.remarks || '',
      }));

    const attendance = await Attendance.create({
      date: attendanceDate,
      subject,
      className,
      department: department || req.user.department,
      markedBy: req.user.id,
      records: attendanceRecords,
    });

    return res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        _id: attendance._id,
        date: attendance.date,
        subject: attendance.subject,
        className: attendance.className,
        totalStudents: attendanceRecords.length,
        presentCount: attendanceRecords.filter(r => r.status === 'present').length,
        absentCount: attendanceRecords.filter(r => r.status === 'absent').length,
        lateCount: attendanceRecords.filter(r => r.status === 'late').length,
      },
    });
  } catch (error) {
    console.error('markAttendance error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student views their own attendance with percentage
// ── @route   GET /api/academic/attendance/my
// ── @access  Student
const getStudentAttendance = async (req, res) => {
  try {
    const { subject, startDate, endDate } = req.query;
    const studentId = req.user.id;

    const filter = { 'records.student': studentId };
    if (subject) filter.subject = subject;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const attendanceList = await Attendance.find(filter)
      .sort({ date: -1 })
      .select('date subject className records');

    // Extract student-specific records
    const studentRecords = attendanceList.map(a => {
      const record = a.records.find(r => r.student.toString() === studentId);
      return {
        _id: a._id,
        date: a.date,
        subject: a.subject,
        className: a.className,
        status: record ? record.status : 'absent',
        remarks: record ? record.remarks : '',
      };
    });

    // Calculate percentage per subject
    const subjectMap = {};
    studentRecords.forEach(r => {
      if (!subjectMap[r.subject]) subjectMap[r.subject] = { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
      subjectMap[r.subject].total += 1;
      subjectMap[r.subject][r.status] = (subjectMap[r.subject][r.status] || 0) + 1;
    });

    const subjectStats = Object.entries(subjectMap).map(([sub, stats]) => ({
      subject: sub,
      ...stats,
      attendancePercentage: stats.total > 0
        ? (((stats.present + stats.late) / stats.total) * 100).toFixed(2)
        : '0.00',
    }));

    const total = studentRecords.length;
    const presentTotal = studentRecords.filter(r => r.status === 'present' || r.status === 'late').length;
    const overallPercentage = total > 0 ? ((presentTotal / total) * 100).toFixed(2) : '0.00';

    return res.status(200).json({
      success: true,
      data: studentRecords,
      subjectStats,
      summary: { total, present: presentTotal, overallPercentage },
    });
  } catch (error) {
    console.error('getStudentAttendance error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Teacher/Admin views class attendance
// ── @route   GET /api/academic/attendance/class
// ── @access  Teacher, Admin, Principal
const getClassAttendance = async (req, res) => {
  try {
    const { className, subject, date, startDate, endDate, page = 1, limit = 30 } = req.query;

    if (!className) {
      return res.status(400).json({ success: false, message: 'className is required' });
    }

    const filter = { className };
    if (subject) filter.subject = subject;
    if (date) {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      filter.date = d;
    } else if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const total = await Attendance.countDocuments(filter);
    const records = await Attendance.find(filter)
      .populate('records.student', 'name loginId')
      .populate('markedBy', 'name loginId')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: records,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getClassAttendance error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get attendance report with monthly/weekly breakdown
// ── @route   GET /api/academic/attendance/report
// ── @access  Teacher, Admin, Principal
const getAttendanceReport = async (req, res) => {
  try {
    const { className, subject, startDate, endDate, groupBy = 'month' } = req.query;

    if (!className) {
      return res.status(400).json({ success: false, message: 'className is required' });
    }

    const matchStage = { className };
    if (subject) matchStage.subject = subject;
    if (startDate || endDate) {
      matchStage.date = {};
      if (startDate) matchStage.date.$gte = new Date(startDate);
      if (endDate) matchStage.date.$lte = new Date(endDate);
    }

    const dateGroupId =
      groupBy === 'week'
        ? { year: { $year: '$date' }, week: { $week: '$date' } }
        : { year: { $year: '$date' }, month: { $month: '$date' } };

    const report = await Attendance.aggregate([
      { $match: matchStage },
      { $unwind: '$records' },
      {
        $group: {
          _id: dateGroupId,
          totalClasses: { $sum: 1 },
          presentCount: { $sum: { $cond: [{ $eq: ['$records.status', 'present'] }, 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ['$records.status', 'absent'] }, 1, 0] } },
          lateCount: { $sum: { $cond: [{ $eq: ['$records.status', 'late'] }, 1, 0] } },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 } },
    ]);

    // Per-student summary
    const studentSummary = await Attendance.aggregate([
      { $match: matchStage },
      { $unwind: '$records' },
      {
        $group: {
          _id: '$records.student',
          totalClasses: { $sum: 1 },
          presentCount: { $sum: { $cond: [{ $eq: ['$records.status', 'present'] }, 1, 0] } },
          absentCount: { $sum: { $cond: [{ $eq: ['$records.status', 'absent'] }, 1, 0] } },
          lateCount: { $sum: { $cond: [{ $eq: ['$records.status', 'late'] }, 1, 0] } },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'studentInfo',
        },
      },
      { $unwind: { path: '$studentInfo', preserveNullAndEmpty: true } },
      {
        $project: {
          studentName: '$studentInfo.name',
          loginId: '$studentInfo.loginId',
          totalClasses: 1,
          presentCount: 1,
          absentCount: 1,
          lateCount: 1,
          attendancePercentage: {
            $round: [{ $multiply: [{ $divide: [{ $add: ['$presentCount', '$lateCount'] }, '$totalClasses'] }, 100] }, 2],
          },
        },
      },
      { $sort: { attendancePercentage: 1 } },
    ]);

    return res.status(200).json({
      success: true,
      data: { timeBreakdown: report, studentSummary, groupBy },
    });
  } catch (error) {
    console.error('getAttendanceReport error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Teacher corrects/updates an attendance record
// ── @route   PUT /api/academic/attendance/:id
// ── @access  Teacher (owner), Admin
const updateAttendance = async (req, res) => {
  try {
    const { records } = req.body;

    if (!records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'records array is required' });
    }

    const attendance = await Attendance.findById(req.params.id);
    if (!attendance) return res.status(404).json({ success: false, message: 'Attendance record not found' });

    // Only the teacher who marked it or admin can update
    if (req.user.role === 'teacher' && attendance.markedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You can only update your own attendance records' });
    }

    // Update individual student records
    records.forEach(update => {
      const existing = attendance.records.find(r => r.student.toString() === update.studentId.toString());
      if (existing) {
        existing.status = update.status || existing.status;
        existing.remarks = update.remarks !== undefined ? update.remarks : existing.remarks;
      }
    });

    attendance.lastUpdatedBy = req.user.id;
    attendance.lastUpdatedAt = new Date();
    await attendance.save();

    return res.status(200).json({ success: true, message: 'Attendance updated successfully', data: attendance });
  } catch (error) {
    console.error('updateAttendance error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  markAttendance,
  getStudentAttendance,
  getClassAttendance,
  getAttendanceReport,
  updateAttendance,
};

