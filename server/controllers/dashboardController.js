const User = require('../models/User');
const Fees = require('../models/Fees');
const { TransportRequest } = require('../models/Transport');
const { HostelApplication } = require('../models/Hostel');
const { Book, BookIssue } = require('../models/Library');
const Question = require('../models/Question');
const Complaint = require('../models/Complaint');
const Attendance = require('../models/Attendance');

/**
 * @desc    Get aggregated dashboard stats based on user role
 * @route   GET /api/dashboard/stats
 */
exports.getDashboardStats = async (req, res) => {
  try {
    const { role, department, id } = req.user;
    let data = {};

    if (role === 'admin') {
      // 1. Total Users
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
      
      // 2. Active Today (logins in last 24h)
      const activeToday = await User.countDocuments({ lastLogin: { $gte: new Date(Date.now() - 24*60*60*1000) } });
      
      // 3. Fees Collected (total sum of all paid fees)
      const allFees = await Fees.find({ status: { $in: ['paid', 'partial'] } });
      const feesCollected = allFees.reduce((acc, f) => acc + (f.paidAmount || 0), 0);
      
      // 4. Pending Requests (Hostel + Transport)
      const pendingHostel = await HostelApplication.countDocuments({ status: 'pending' });
      const pendingTransport = await TransportRequest.countDocuments({ status: 'pending' });
      
      // 5. Library Books
      const totalBooks = await Book.aggregate([{ $group: { _id: null, total: { $sum: "$totalCopies" } } }]);
      const issuedBooks = await BookIssue.countDocuments({ status: 'issued' });

      // Recent Logins
      const recentLogins = await User.find({ isActive: true })
        .sort({ lastLogin: -1 })
        .limit(4)
        .select('name loginId role department lastLogin');

      // Revenue over months (dummy logic for simple chart since creating complex aggregation by month takes a lot of time)
      // Just returning 6 months of data, maybe static with some randomness or using actual data if dates are spread out.
      // We will provide recent fee payments aggregated roughly or just return the total.
      
      data = {
        stats: {
          totalUsers,
          totalStudents,
          activeToday,
          feesCollected,
          pendingRequests: pendingHostel + pendingTransport,
          totalBooks: totalBooks[0] ? totalBooks[0].total : 0,
          issuedBooks
        },
        recentLogins,
      };

    } else if (role === 'principal') {
      const totalStudents = await User.countDocuments({ role: 'student', isActive: true });
      const totalStaff = await User.countDocuments({ role: { $in: ['teacher', 'hod', 'coordinator', 'admin'] }, isActive: true });
      
      const pendingQuestions = await Question.find({ status: 'pending' })
        .populate('teacherId', 'name')
        .sort({ createdAt: -1 })
        .limit(5);

      const pendingQuestionsCount = await Question.countDocuments({ status: 'pending' });

      const openComplaints = await Complaint.find({ status: 'open' })
        .populate('studentId', 'name loginId')
        .sort({ createdAt: -1 })
        .limit(5);
        
      const openComplaintsCount = await Complaint.countDocuments({ status: 'open' });

      data = {
        stats: {
          totalStudents,
          totalStaff,
          pendingQuestionsCount,
          openComplaintsCount
        },
        pendingQuestions,
        openComplaints
      };

    } else if (role === 'teacher') {
      const myQuestions = await Question.find({ teacherId: id, status: 'pending' });
      const myStudents = await User.countDocuments({ role: 'student', department: department });

      // Teacher timetable - just static fallback for now since Timetable schema might be complex to parse
      // Or we count attendance marked today
      const attendanceToday = await Attendance.countDocuments({
        markedBy: id,
        date: { $gte: new Date(new Date().setHours(0,0,0,0)) }
      });

      data = {
        stats: {
          myStudents,
          pendingQuestionsCount: myQuestions.length,
          attendanceMarkedToday: attendanceToday
        }
      };
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error' });
  }
};
