const mongoose = require('mongoose');
const Fee = require('./models/Fees');

async function check() {
  await mongoose.connect('mongodb://127.0.0.1:27017/school_erp');
  const fee = await Fee.findOne().lean();
  console.log(fee);
  process.exit();
}
check();
