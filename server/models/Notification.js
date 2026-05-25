const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient ID is required'],
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
    },
    type: {
      type: String,
      enum: {
        values: ['info', 'success', 'warning', 'error'],
        message: 'Type must be one of: info, success, warning, error',
      },
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String,
      trim: true,
      default: null, // optional deep-link inside the app
    },
  },
  {
    timestamps: true,
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
notificationSchema.index({ recipientId: 1, isRead: 1 });
notificationSchema.index({ recipientId: 1, createdAt: -1 });
// Optional TTL: auto-delete notifications after 90 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

// ─── Static: mark all notifications read for a user ───────────────────────────
notificationSchema.statics.markAllRead = function (recipientId) {
  return this.updateMany({ recipientId, isRead: false }, { $set: { isRead: true } });
};

// ─── Static: count unread for a user ─────────────────────────────────────────
notificationSchema.statics.countUnread = function (recipientId) {
  return this.countDocuments({ recipientId, isRead: false });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
