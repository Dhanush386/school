const express = require('express');
const router = express.Router();
const { getTimetable, saveTimetable } = require('../controllers/timetableController');
const { protect, restrictTo } = require('../middleware/auth');

router.use(protect);

router.get('/', getTimetable);
router.post('/', restrictTo('admin', 'principal'), saveTimetable);

module.exports = router;
