const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  requestCertificate,
  getMyRequests,
  getAllRequests,
  approveCertificate,
  rejectCertificate,
  downloadCertificate,
} = require('../controllers/certificateController');

router.use(protect);

router.post('/request', authorize('student'), requestCertificate);
router.get('/my', authorize('student'), getMyRequests);
router.get('/', authorize('admin', 'principal'), getAllRequests);
router.patch('/:id/approve', authorize('admin', 'principal'), approveCertificate);
router.patch('/:id/reject', authorize('admin', 'principal'), rejectCertificate);
router.get('/:id/download', downloadCertificate);

module.exports = router;
