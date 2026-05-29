const TransportRoute = require('../models/Transport').TransportRoute;
const TransportRequest = require('../models/Transport').TransportRequest;
const Notification = require('../models/Notification');
const User = require('../models/User');

// ── Helper ────────────────────────────────────────────────────────────────────
const getAdminIds = async () => {
  const admins = await User.find({ role: { $in: ['admin', 'principal'] }, isActive: true }).select('_id');
  return admins.map(a => a._id);
};

// ── @desc    Get all active routes with stops
// ── @route   GET /api/transport/routes
// ── @access  Private
const getAllRoutes = async (req, res) => {
  try {
    const { isActive = true, search, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === 'true' || isActive === true;

    if (search) {
      filter.$or = [
        { routeName: { $regex: search, $options: 'i' } },
        { routeNumber: { $regex: search, $options: 'i' } },
        { 'stops.stopName': { $regex: search, $options: 'i' } },
      ];
    }

    const total = await TransportRoute.countDocuments(filter);
    const routes = await TransportRoute.find(filter)
      .sort({ routeNumber: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: routes,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllRoutes error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student requests transport assignment
// ── @route   POST /api/transport/request
// ── @access  Student
const requestTransport = async (req, res) => {
  try {
    const { routeId, preferredStop, academicYear } = req.body;

    if (!routeId || !preferredStop) {
      return res.status(400).json({ success: false, message: 'routeId and preferredStop are required' });
    }

    // Check if student already has a pending/approved request
    const existing = await TransportRequest.findOne({
      student: req.user.id,
      status: { $in: ['pending', 'approved'] },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: `You already have a ${existing.status} transport request.`,
      });
    }

    const route = await TransportRoute.findById(routeId);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });
    if (!route.isActive) return res.status(400).json({ success: false, message: 'This route is not currently active' });

    // Validate stop exists in route
    const stopExists = route.stops.some(s => s.stopName === preferredStop);
    if (!stopExists) {
      return res.status(400).json({ success: false, message: `Stop "${preferredStop}" not found in this route` });
    }

    const request = await TransportRequest.create({
      student: req.user.id,
      route: routeId,
      preferredStop,
      academicYear,
      status: 'pending',
    });

    // Notify admins
    const adminIds = await getAdminIds();
    const notifications = adminIds.map(aid => ({
      recipient: aid,
      sender: req.user.id,
      type: 'transport_requested',
      title: 'New Transport Request',
      message: `${req.user.name} has requested transport on Route ${route.routeNumber} – ${route.routeName}.`,
      relatedId: request._id,
      relatedModel: 'TransportRequest',
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.status(201).json({ success: true, message: 'Transport request submitted', data: request });
  } catch (error) {
    console.error('requestTransport error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student sees their transport request
// ── @route   GET /api/transport/my-request
// ── @access  Student
const getMyTransportRequest = async (req, res) => {
  try {
    const request = await TransportRequest.findOne({ student: req.user.id })
      .sort({ createdAt: -1 })
      .populate('route', 'routeNumber routeName stops driverName driverContact vehicleNumber')
      .populate('student', 'name loginId department');

    if (!request) return res.status(404).json({ success: false, message: 'No transport request found' });

    return res.status(200).json({ success: true, data: request });
  } catch (error) {
    console.error('getMyTransportRequest error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin approves transport request
// ── @route   PATCH /api/transport/request/:id/approve
// ── @access  Admin
const approveTransportRequest = async (req, res) => {
  try {
    const request = await TransportRequest.findById(req.params.id).populate('route', 'capacity routeNumber routeName');

    if (!request) return res.status(404).json({ success: false, message: 'Request not found' });

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${request.status}` });
    }

    // Check route capacity
    const currentlyApproved = await TransportRequest.countDocuments({
      route: request.route._id,
      status: 'approved',
    });

    if (currentlyApproved >= request.route.capacity) {
      return res.status(400).json({
        success: false,
        message: `Route ${request.route.routeNumber} is at full capacity (${request.route.capacity})`,
      });
    }

    request.status = 'approved';
    request.reviewedBy = req.user.id;
    request.reviewedAt = new Date();
    request.adminRemarks = req.body.remarks || '';
    await request.save();

    await Notification.create({
      recipient: request.student,
      sender: req.user.id,
      type: 'transport_approved',
      title: 'Transport Request Approved',
      message: `Your transport request for Route ${request.route.routeNumber} – ${request.route.routeName} has been approved.`,
      relatedId: request._id,
      relatedModel: 'TransportRequest',
    });

    return res.status(200).json({ success: true, message: 'Transport request approved', data: request });
  } catch (error) {
    console.error('approveTransportRequest error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin adds a new transport route
// ── @route   POST /api/transport/routes
// ── @access  Admin
const addRoute = async (req, res) => {
  try {
    const { routeNumber, routeName, startPoint, endPoint, stops, driverName, driverContact, vehicleNumber, capacity } = req.body;

    if (!routeNumber || !routeName || !startPoint || !endPoint) {
      return res.status(400).json({ success: false, message: 'routeNumber, routeName, startPoint and endPoint are required' });
    }

    const existing = await TransportRoute.findOne({ routeNumber });
    if (existing) {
      return res.status(400).json({ success: false, message: `Route number ${routeNumber} already exists` });
    }

    const route = await TransportRoute.create({
      routeNumber,
      routeName,
      stops: stops || [],
      driverName,
      driverPhone: driverContact,
      busNumber: vehicleNumber,
      isActive: true,
    });

    return res.status(201).json({ success: true, message: 'Route added successfully', data: route });
  } catch (error) {
    console.error('addRoute error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin updates a transport route
// ── @route   PUT /api/transport/routes/:id
// ── @access  Admin
const updateRoute = async (req, res) => {
  try {
    const route = await TransportRoute.findById(req.params.id);
    if (!route) return res.status(404).json({ success: false, message: 'Route not found' });

    const allowedFields = ['routeName', 'stops', 'driverName', 'driverPhone', 'busNumber', 'isActive'];
    
    // Support mapping from UI names if provided
    if (req.body.vehicleNumber !== undefined) route.busNumber = req.body.vehicleNumber;
    if (req.body.driverContact !== undefined) route.driverPhone = req.body.driverContact;
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) route[field] = req.body[field];
    });

    await route.save();
    return res.status(200).json({ success: true, message: 'Route updated successfully', data: route });
  } catch (error) {
    console.error('updateRoute error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllRoutes,
  requestTransport,
  getMyTransportRequest,
  approveTransportRequest,
  addRoute,
  updateRoute,
};

