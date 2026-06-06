const path = require('path');
const Certificate = require('../models/Certificate');
const User = require('../models/User');
const Notification = require('../models/Notification');
const generateCertificatePDF = require('../utils/generateCertificatePDF');

// ── Helper: get admins ────────────────────────────────────────────────────────
const getAdminIds = async () => {
  const admins = await User.find({ role: { $in: ['admin', 'principal'] }, isActive: true }).select('_id');
  return admins.map(a => a._id);
};

// ── @desc    Student requests a certificate
// ── @route   POST /api/certificates/request
// ── @access  Student
const requestCertificate = async (req, res) => {
  try {
    const { certificateType, purpose, className, academicYear } = req.body;

    const validTypes = ['bonafide', 'transfer', 'completion', 'character', 'migration'];
    if (!certificateType || !validTypes.includes(certificateType)) {
      return res.status(400).json({ success: false, message: `certificateType must be one of: ${validTypes.join(', ')}` });
    }

    // Prevent duplicate pending request for same type
    const existing = await Certificate.findOne({
      studentId: req.user.id,
      type: certificateType,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({ success: false, message: `You already have a pending ${certificateType} certificate request` });
    }

    const certificate = await Certificate.create({
      studentId: req.user.id,
      type: certificateType,
      purpose: purpose?.trim(),
      className,
      academicYear,
      status: 'pending',
    });

    // Notify admins
    const adminIds = await getAdminIds();
    const notifications = adminIds.map(aid => ({
      recipientId: aid,
      type: 'info',
      title: 'Certificate Request',
      message: `${req.user.name} has requested a ${certificateType} certificate.`,
      link: '/certificates'
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    return res.status(201).json({ success: true, message: 'Certificate request submitted', data: certificate });
  } catch (error) {
    console.error('requestCertificate error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Student views their certificate requests
// ── @route   GET /api/certificates/my
// ── @access  Student
const getMyRequests = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { studentId: req.user.id };
    if (status) filter.status = status;

    const requests = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .populate('approvedBy', 'name loginId role');

    return res.status(200).json({ success: true, data: requests, count: requests.length });
  } catch (error) {
    console.error('getMyRequests error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin views all certificate requests
// ── @route   GET /api/certificates
// ── @access  Admin, Principal
const getAllRequests = async (req, res) => {
  try {
    const { status, certificateType, search, page = 1, limit = 15 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (certificateType) filter.certificateType = certificateType;

    if (search) {
      const users = await User.find({
        $or: [{ name: { $regex: search, $options: 'i' } }, { loginId: { $regex: search, $options: 'i' } }],
        role: 'student',
      }).select('_id');
      filter.studentId = { $in: users.map(u => u._id) };
    }

    const total = await Certificate.countDocuments(filter);
    const requests = await Certificate.find(filter)
      .populate('studentId', 'name loginId department')
      .populate('approvedBy', 'name loginId role')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    return res.status(200).json({
      success: true,
      data: requests,
      pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('getAllRequests error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin approves and generates certificate PDF
// ── @route   PATCH /api/certificates/:id/approve
// ── @access  Admin, Principal
const approveCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id).populate('studentId', 'name loginId department');

    if (!cert) return res.status(404).json({ success: false, message: 'Certificate request not found' });

    cert.status = 'approved';
    cert.approvedBy = req.user.id;
    cert.approvedAt = new Date();
    cert.adminRemarks = req.body.remarks || '';
    await cert.save();

    await Notification.create({
      recipientId: cert.studentId._id,
      type: 'success',
      title: 'Certificate Ready',
      message: `Your ${cert.type} certificate has been approved and is ready for download.`,
      link: '/certificates'
    });

    return res.status(200).json({
      success: true,
      message: 'Certificate approved and generated',
      data: cert,
    });
  } catch (error) {
    console.error('approveCertificate error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Admin rejects a certificate request
// ── @route   PATCH /api/certificates/:id/reject
// ── @access  Admin, Principal
const rejectCertificate = async (req, res) => {
  try {
    const { remarks } = req.body;
    if (!remarks || remarks.trim().length < 5) {
      return res.status(400).json({ success: false, message: 'Rejection remarks (min 5 chars) are required' });
    }

    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate request not found' });

    if (cert.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${cert.status}` });
    }

    cert.status = 'rejected';
    cert.approvedBy = req.user.id;
    cert.approvedAt = new Date();
    cert.adminRemarks = remarks.trim();
    await cert.save();

    await Notification.create({
      recipientId: cert.studentId,
      type: 'error',
      title: 'Certificate Request Rejected',
      message: `Your ${cert.type} certificate request was rejected. Reason: ${remarks.trim()}`,
      link: '/certificates'
    });

    return res.status(200).json({ success: true, message: 'Certificate request rejected', data: cert });
  } catch (error) {
    console.error('rejectCertificate error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Download a certificate PDF
// ── @route   GET /api/certificates/:id/download
// ── @access  Student (owner) / Admin
const downloadCertificate = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id).populate('studentId', 'name loginId department');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    // Access control
    if (req.user.role === 'student' && cert.studentId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (cert.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Certificate is not yet approved' });
    }

    const pdfBuffer = await generateCertificatePDF({
      certificateType: cert.type,
      studentName: cert.studentId.name,
      studentId: cert.studentId.loginId,
      department: cert.studentId.department,
      className: cert.className || 'N/A',
      academicYear: cert.academicYear || 'N/A',
      purpose: cert.purpose,
      remarks: cert.adminRemarks,
      issueDate: cert.approvedAt || new Date(),
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Certificate_${cert.type}.pdf"`);
    return res.send(pdfBuffer);
  } catch (error) {
    console.error('downloadCertificate error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  requestCertificate,
  getMyRequests,
  getAllRequests,
  approveCertificate,
  rejectCertificate,
  downloadCertificate,
};

