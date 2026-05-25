const cron = require('node-cron');
const mongoose = require('mongoose');

// Import models lazily to avoid circular deps at startup
let BookIssue, Fees, Certificate, Notification;

const initModels = () => {
  BookIssue = require('../models/Library').BookIssue;
  Fees = require('../models/Fees');
  Certificate = require('../models/Certificate');
  Notification = require('../models/Notification');
};

const log = (msg) => {
  const ts = new Date().toISOString();
  console.log(`[CRON] [${ts}] ${msg}`);
};

/**
 * Daily 8:00 AM — Mark overdue library books
 */
const markOverdueBooks = async () => {
  try {
    const now = new Date();
    const result = await BookIssue.updateMany(
      { dueDate: { $lt: now }, status: 'issued' },
      { $set: { status: 'overdue' } }
    );
    log(`Overdue books updated: ${result.modifiedCount} records`);
  } catch (err) {
    log(`ERROR marking overdue books: ${err.message}`);
  }
};

/**
 * Daily 9:00 AM — Mark overdue fee payments
 */
const markOverdueFees = async () => {
  try {
    const now = new Date();
    const result = await Fees.updateMany(
      { dueDate: { $lt: now }, status: 'pending' },
      { $set: { status: 'overdue' } }
    );
    log(`Overdue fees updated: ${result.modifiedCount} records`);
  } catch (err) {
    log(`ERROR marking overdue fees: ${err.message}`);
  }
};

/**
 * Daily 7:00 AM — Notify admin of stale certificate requests (>3 days old)
 */
const notifyPendingCertificates = async () => {
  try {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const staleCerts = await Certificate.find({
      status: 'pending',
      createdAt: { $lt: threeDaysAgo },
    }).select('_id studentId type');

    if (staleCerts.length === 0) {
      log('No stale certificate requests found.');
      return;
    }

    // Create notifications for admin users
    const User = require('../models/User');
    const admins = await User.find({ role: 'admin' }).select('_id');

    const notifications = admins.flatMap(admin =>
      staleCerts.map(cert => ({
        recipientId: admin._id,
        title: 'Pending Certificate Request',
        message: `Certificate request (${cert.type}) is pending for more than 3 days. Please review.`,
        type: 'warning',
        link: '/admission/certificate',
      }))
    );

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
      log(`Created ${notifications.length} stale-certificate notifications.`);
    }
  } catch (err) {
    log(`ERROR notifying pending certificates: ${err.message}`);
  }
};

/**
 * Initialize all cron jobs.
 * Call this once after DB is connected.
 */
const initCronJobs = () => {
  initModels();

  // Daily at 07:00 AM
  cron.schedule('0 7 * * *', () => {
    log('Running: notifyPendingCertificates');
    notifyPendingCertificates();
  }, { timezone: 'Asia/Kolkata' });

  // Daily at 08:00 AM
  cron.schedule('0 8 * * *', () => {
    log('Running: markOverdueBooks');
    markOverdueBooks();
  }, { timezone: 'Asia/Kolkata' });

  // Daily at 09:00 AM
  cron.schedule('0 9 * * *', () => {
    log('Running: markOverdueFees');
    markOverdueFees();
  }, { timezone: 'Asia/Kolkata' });

  log('All cron jobs initialized (timezone: Asia/Kolkata)');
};

module.exports = { initCronJobs };
