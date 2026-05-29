const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getDashboardStats } = require('../controllers/dashboardController');

// All dashboard routes require authentication
router.use(protect);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Get dashboard statistics based on the authenticated user's role
 * @access  Private
 */
router.get('/stats', getDashboardStats);

module.exports = router;
