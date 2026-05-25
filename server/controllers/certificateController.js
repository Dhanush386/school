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

    const validTypes = ['bonafide', 'transfer', 'conduct', 'study'];
    if (!certificateType || !validTypes.includes(certificateType)) {
      return res.status(400).json({ success: false, message: `certificateType must be one of: ${validTypes.join(', ')}` });
    }

    // Prevent duplicate pending request for same type
    const existing = await Certificate.findOne({
      student: req.user.id,
      certificateType,
      status: 'pending',
    });
    if (existing) {
      return res.status(400).json({ success: false, message: `You already have a pending ${certificateType} certificate request` });
    }

    const certificate = await Certificate.create({
      student: req.user.id,
      certificateType,
      purpose: purpose?.trim(),
      className,
      academicYear,
      status: 'pending',
    });

    // Notify admins
    const adminIds = await getAdminIds();
    const notifications = adminIds.map(aid => ({
      recipient: aid,
      sender: req.user.id,
      type: 'certificate_requested',
      title: 'Certificate Request',
      message: `${req.user.name} has requested a ${certificateType} certificate.`,
      relatedId: certificate._id,
      relatedModel: 'Certificate',
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
    const filter = { student: req.user.id };
    if (status) filter.status = status;

    const requests = await Certificate.find(filter)
      .sort({ createdAt: -1 })
      .populate('reviewedBy', 'name loginId role');

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
      filter.student = { $in: users.map(u => u._id) };
    }

    const total = await Certificate.countDocuments(filter);
    const requests = await Certificate.find(filter)
      .populate('student', 'name loginId department')
      .populate('reviewedBy', 'name loginId role')
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
    const cert = await Certificate.findById(req.params.id).populate('student', 'name loginId department');

    if (!cert) return res.status(404).json({ success: false, message: 'Certificate request not found' });

    if (cert.status !== 'pending') {
      return res.status(400).json({ success: false, message: `Request is already ${cert.status}` });
    }

    // Generate PDF
    const pdfFilename = await generateCertificatePDF({
      certificateType: cert.certificateType,
      studentName: cert.student.name,
      studentId: cert.student.loginId,
      department: cert.student.department,
      className: cert.className || 'N/A',
      academicYear: cert.academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
      purpose: cert.purpose,
      remarks: req.body.remarks || '',
      issueDate: new Date(),
    });

    cert.status = 'approved';
    cert.reviewedBy = req.user.id;
    cert.reviewedAt = new Date();
    cert.adminRemarks = req.body.remarks || '';
    cert.pdfFilename = pdfFilename;
    cert.issuedAt = new Date();
    await cert.save();

    await Notification.create({
      recipient: cert.student._id,
      sender: req.user.id,
      type: 'certificate_approved',
      title: 'Certificate Ready',
      message: `Your ${cert.certificateType} certificate has been approved and is ready for download.`,
      relatedId: cert._id,
      relatedModel: 'Certificate',
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
    cert.reviewedBy = req.user.id;
    cert.reviewedAt = new Date();
    cert.adminRemarks = remarks.trim();
    await cert.save();

    await Notification.create({
      recipient: cert.student,
      sender: req.user.id,
      type: 'certificate_rejected',
      title: 'Certificate Request Rejected',
      message: `Your ${cert.certificateType} certificate request was rejected. Reason: ${remarks.trim()}`,
      relatedId: cert._id,
      relatedModel: 'Certificate',
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
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    // Access control
    if (req.user.role === 'student' && cert.student.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (cert.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Certificate is not yet approved' });
    }

    if (!cert.pdfFilename) {
      return res.status(404).json({ success: false, message: 'Certificate file not found' });
    }

    const certPath = path.join(__dirname, '..', 'uploads', 'certificates', cert.pdfFilename);
    return res.download(certPath, cert.pdfFilename, (err) => {
      if (err) {
        console.error('Certificate download error:', err);
        return res.status(500).json({ success: false, message: 'Could not download certificate' });
      }
    });
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

