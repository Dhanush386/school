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

const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.use(protect);

router.post('/request', authorize('student'), requestCertificate);
router.get('/my', authorize('student'), getMyRequests);
router.get('/', authorize('admin', 'principal'), getAllRequests);
router.patch('/:id/approve', authorize('admin', 'principal'), upload.single('file'), approveCertificate);
router.patch('/:id/reject', authorize('admin', 'principal'), rejectCertificate);
router.get('/:id/download', downloadCertificate);

module.exports = router;
