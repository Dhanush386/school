const Attendance = require('../models/Attendance');
const User = require('../models/User');
const twilio = require('twilio');

const getTwilioClient = () => {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    return twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  }
  return null;
};

// ── @desc    Teacher marks attendance for their class
// ── @route   POST /api/academic/attendance
// ── @access  Teacher, Admin
const markAttendance = async (req, res) => {
  try {
    const { date, session, className, department, records } = req.body;

    if (!date || !session || !className || !records || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'date, session, className and records are required' });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check for duplicate
    const duplicate = await Attendance.findOne({
      date: attendanceDate,
      session,
      className,
      markedBy: req.user.id,
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'Attendance for this class/session/date has already been marked. Use update instead.',
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
      session,
      className,
      department: department || req.user.department,
      markedBy: req.user.id,
      records: attendanceRecords,
    });

    // Twilio Voice Call Logic
    const absentStudentIds = attendanceRecords.filter(r => r.status === 'absent').map(r => r.student);
    if (absentStudentIds.length > 0) {
      const absentUsers = await User.find({ _id: { $in: absentStudentIds } });
      const twilioClient = getTwilioClient();
      
      const shouldCallList = [];
      if (session === 'Morning') {
        shouldCallList.push(...absentUsers);
      } else if (session === 'Evening') {
        const morningAttendance = await Attendance.findOne({ date: attendanceDate, session: 'Morning', className });
        if (morningAttendance) {
          const morningAbsentSet = new Set(
            morningAttendance.records.filter(r => r.status === 'absent').map(r => r.student.toString())
          );
          for (const user of absentUsers) {
            if (!morningAbsentSet.has(user._id.toString())) {
              shouldCallList.push(user);
            }
          }
        } else {
          shouldCallList.push(...absentUsers);
        }
      }

      if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
        for (const user of shouldCallList) {
          if (user.phone) {
            const twiml = new twilio.twiml.VoiceResponse();
            twiml.say({ language: 'en-IN', voice: 'Polly.Aditi' }, `Hello. This is to inform you that your child, ${user.name}, is absent for today. Thank you.`);
            twiml.pause({ length: 1 });
            twiml.say({ language: 'ta-IN', voice: 'Polly.Aditi' }, `வணக்கம். உங்கள் குழந்தை ${user.name} இன்று பள்ளிக்கு வரவில்லை என்பதை தெரிவித்துக் கொள்கிறோம். நன்றி.`);
            
            try {
              await twilioClient.calls.create({
                twiml: twiml.toString(),
                to: user.phone,
                from: process.env.TWILIO_PHONE_NUMBER
              });
              console.log(`Twilio call initiated for absent student ${user.name}`);
            } catch (callErr) {
              console.error(`Failed to initiate Twilio call for ${user.name}:`, callErr.message);
            }
          }
        }
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Attendance marked successfully',
      data: {
        _id: attendance._id,
        date: attendance.date,
        session: attendance.session,
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
    const { session, startDate, endDate } = req.query;
    const studentId = req.user.id;

    const filter = { 'records.student': studentId };
    if (session) filter.session = session;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const attendanceList = await Attendance.find(filter)
      .sort({ date: -1 })
      .select('date session className records');

    // Extract student-specific records
    const studentRecords = attendanceList.map(a => {
      const record = a.records.find(r => r.student.toString() === studentId);
      return {
        _id: a._id,
        date: a.date,
        session: a.session,
        className: a.className,
        status: record ? record.status : 'absent',
        remarks: record ? record.remarks : '',
      };
    });

    // Calculate percentage per session
    const sessionMap = {};
    studentRecords.forEach(r => {
      if (!sessionMap[r.session]) sessionMap[r.session] = { total: 0, present: 0, absent: 0, late: 0, excused: 0 };
      sessionMap[r.session].total += 1;
      sessionMap[r.session][r.status] = (sessionMap[r.session][r.status] || 0) + 1;
    });

    const sessionStats = Object.entries(sessionMap).map(([sub, stats]) => ({
      session: sub,
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
      sessionStats,
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
    const { className, session, date, startDate, endDate, page = 1, limit = 30 } = req.query;

    if (!className) {
      return res.status(400).json({ success: false, message: 'className is required' });
    }

    const filter = { className };
    if (session) filter.session = session;
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
    const { className, session, startDate, endDate, groupBy = 'month' } = req.query;

    if (!className) {
      return res.status(400).json({ success: false, message: 'className is required' });
    }

    const matchStage = { className };
    if (session) matchStage.session = session;
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

