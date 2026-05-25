const express = require('express');
const router = express.Router();
const { runAllCronJobs } = require('../cron/reminderJobs');

// Endpoint triggered by Vercel Cron
router.get('/reminders', async (req, res) => {
  // Secure the cron endpoint in production (optional but recommended in Vercel)
  if (
    process.env.VERCEL &&
    process.env.CRON_SECRET &&
    req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await runAllCronJobs();
    res.status(200).json({ success: true, message: 'Cron jobs executed successfully.' });
  } catch (error) {
    console.error('Error executing cron jobs:', error);
    res.status(500).json({ success: false, error: 'Failed to execute cron jobs' });
  }
});

module.exports = router;
