const Notification = require('../models/Notification');

// ── @desc    Get user's notifications
// ── @route   GET /api/notifications
// ── @access  Private
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50

    return res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    console.error('getMyNotifications error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Mark a notification as read
// ── @route   PUT /api/notifications/:id/read
// ── @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, recipientId: req.user.id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    return res.status(200).json({ success: true, data: notification });
  } catch (error) {
    console.error('markAsRead error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Mark all notifications as read
// ── @route   PUT /api/notifications/read-all
// ── @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.markAllRead(req.user.id);
    return res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('markAllAsRead error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// ── @desc    Get unread notification count
// ── @route   GET /api/notifications/unread-count
// ── @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countUnread(req.user.id);
    return res.status(200).json({ success: true, data: count });
  } catch (error) {
    console.error('getUnreadCount error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
};
