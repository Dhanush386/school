require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    let admin = await User.findOne({ loginId: 'ADM001' });
    if (!admin) {
      console.log('ADM001 not found! Creating one...');
      admin = new User({
        name: 'Super Admin',
        loginId: 'ADM001',
        password: 'password123', // will be hashed by pre-save hook
        role: 'admin',
        department: 'Management',
        mustChangePassword: false,
        isActive: true,
      });
    } else {
      console.log('ADM001 found. Resetting password to password123');
      admin.password = 'password123';
      admin.mustChangePassword = false;
    }

    await admin.save();
    console.log('Admin user saved successfully. Login with ADM001 / password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

resetAdmin();
