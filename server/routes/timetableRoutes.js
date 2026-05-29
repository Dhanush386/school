const express = require('express');
const router = express.Router();
const { getTimetable, saveTimetable } = require('../controllers/timetableController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getTimetable);
router.post('/', authorize('admin', 'principal'), saveTimetable);

module.exports = router;
