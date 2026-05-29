const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/school_erp');
  const user = await User.findOne({ loginId: 'CASHIER001' });
  console.log("CASHIER in DB:", !!user, user ? user.role : 'not found');
  process.exit();
}
check();
