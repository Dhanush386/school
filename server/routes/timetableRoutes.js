const express = require('require');
// Wait, `require('express')`
const router = require('express').Router();
const { getTimetable, saveTimetable } = require('../controllers/timetableController');
const { protect, restrictTo } = require('../middlewares/auth');

router.use(protect);

router.get('/', getTimetable);
router.post('/', restrictTo('admin', 'principal'), saveTimetable);

module.exports = router;
