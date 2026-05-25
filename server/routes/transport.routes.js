const express = require('express');
const router = express.Router();

const { protect, authorize } = require('../middleware/auth');
const {
  getAllRoutes,
  requestTransport,
  getMyTransportRequest,
  approveTransportRequest,
  addRoute,
  updateRoute,
} = require('../controllers/transportController');

// All routes require authentication
router.use(protect);

// ════════════════════════════════════════════════════════
//  ROUTE MANAGEMENT (Admin)
// ════════════════════════════════════════════════════════

/**
 * @route   GET /api/transport/routes
 * @desc    Get all active transport routes with stops
 * @access  Private (all roles)
 */
router.get('/routes', getAllRoutes);

/**
 * @route   POST /api/transport/routes
 * @desc    Admin adds a new transport route
 * @access  Admin
 */
router.post(
  '/routes',
  authorize('admin'),
  addRoute
);

/**
 * @route   PUT /api/transport/routes/:id
 * @desc    Admin updates an existing transport route
 * @access  Admin
 */
router.put(
  '/routes/:id',
  authorize('admin'),
  updateRoute
);

// ════════════════════════════════════════════════════════
//  STUDENT TRANSPORT REQUESTS
// ════════════════════════════════════════════════════════

/**
 * @route   POST /api/transport/request
 * @desc    Student requests transport assignment on a route
 * @access  Student
 */
router.post(
  '/request',
  authorize('student'),
  requestTransport
);

/**
 * @route   GET /api/transport/my-request
 * @desc    Student views their transport request and assigned route
 * @access  Student
 */
router.get(
  '/my-request',
  authorize('student'),
  getMyTransportRequest
);

/**
 * @route   GET /api/transport/requests
 * @desc    Admin views all pending/approved transport requests
 * @access  Admin, Principal
 */
router.get(
  '/requests',
  authorize('admin', 'principal'),
  async (req, res) => {
    // Inline handler to list all requests with population
    try {
      const TransportRequest = require('../models/Transport').TransportRequest;
      const User = require('../models/User');
      const { status, page = 1, limit = 15, search } = req.query;
      const filter = {};
      if (status) filter.status = status;
      if (search) {
        const users = await User.find({
          $or: [{ name: { $regex: search, $options: 'i' } }, { loginId: { $regex: search, $options: 'i' } }],
          role: 'student',
        }).select('_id');
        filter.student = { $in: users.map(u => u._id) };
      }
      const total = await TransportRequest.countDocuments(filter);
      const requests = await TransportRequest.find(filter)
        .populate('student', 'name loginId department')
        .populate('route', 'routeNumber routeName stops')
        .populate('reviewedBy', 'name loginId')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
      return res.status(200).json({
        success: true,
        data: requests,
        pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

/**
 * @route   PATCH /api/transport/request/:id/approve
 * @desc    Admin approves a transport request (checks route capacity)
 * @access  Admin
 */
router.patch(
  '/request/:id/approve',
  authorize('admin', 'principal'),
  approveTransportRequest
);

/**
 * @route   PATCH /api/transport/request/:id/reject
 * @desc    Admin rejects a transport request
 * @access  Admin
 */
router.patch(
  '/request/:id/reject',
  authorize('admin', 'principal'),
  async (req, res) => {
    try {
      const TransportRequest = require('../models/Transport').TransportRequest;
      const Notification = require('../models/Notification');
      const { reason } = req.body;
      if (!reason || reason.trim().length < 3) {
        return res.status(400).json({ success: false, message: 'Rejection reason is required' });
      }
      const request = await TransportRequest.findById(req.params.id).populate('route', 'routeNumber routeName');
      if (!request) return res.status(404).json({ success: false, message: 'Request not found' });
      if (request.status !== 'pending') {
        return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
      }
      request.status = 'rejected';
      request.reviewedBy = req.user.id;
      request.reviewedAt = new Date();
      request.adminRemarks = reason.trim();
      await request.save();
      await Notification.create({
        recipient: request.student,
        sender: req.user.id,
        type: 'transport_rejected',
        title: 'Transport Request Rejected',
        message: `Your transport request for Route ${request.route.routeNumber} was rejected. Reason: ${reason.trim()}`,
        relatedId: request._id,
        relatedModel: 'TransportRequest',
      });
      return res.status(200).json({ success: true, message: 'Transport request rejected', data: request });
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  }
);

module.exports = router;

