require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function dump() {
  await mongoose.connect(process.env.MONGO_URI);
  const admins = await User.find({ loginId: /ADM001/i }).select('+password');
  console.log("Found admins:", admins.length);
  for (const admin of admins) {
    console.log(`ID: "${admin.loginId}", Role: ${admin.role}, isActive: ${admin.isActive}, PwdHash: ${admin.password}`);
  }
  process.exit(0);
}

dump();
