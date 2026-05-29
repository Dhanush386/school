require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const admin = await User.findOne({ loginId: 'ADM001' });
  if (!admin) {
    console.log("Admin not found in DB!");
    process.exit(1);
  }
  const isMatch = await admin.comparePassword('password123');
  console.log("Password match for password123:", isMatch);
  process.exit(0);
}

check();
