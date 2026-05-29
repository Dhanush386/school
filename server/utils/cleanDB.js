require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Fee = require('../models/Fees');
const Notification = require('../models/Notification');

async function cleanDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find all users who are NOT admins and NOT cashiers
    const fakeUsers = await User.find({ role: { $nin: ['admin', 'cashier'] } });
    const fakeUserIds = fakeUsers.map(u => u._id);

    console.log(`Found ${fakeUsers.length} fake users to delete.`);

    // Delete associated fees
    const deletedFees = await Fee.deleteMany({
      $or: [{ student: { $in: fakeUserIds } }, { studentId: { $in: fakeUserIds } }]
    });
    console.log(`Deleted ${deletedFees.deletedCount} fees belonging to fake users.`);

    // Delete associated notifications
    const deletedNotifications = await Notification.deleteMany({ recipient: { $in: fakeUserIds } });
    console.log(`Deleted ${deletedNotifications.deletedCount} notifications.`);

    // Delete the users
    const deletedUsers = await User.deleteMany({ _id: { $in: fakeUserIds } });
    console.log(`Deleted ${deletedUsers.deletedCount} fake users.`);

    console.log('Database cleanup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error cleaning database:', error);
    process.exit(1);
  }
}

cleanDatabase();
