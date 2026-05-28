const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  studentName: {
    type: String
  },
  razorpayOrderId: {
    type: String,
    required: true,
    unique: true
  },
  razorpayPaymentId: {
    type: String
  },
  razorpaySignature: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: ['created', 'successful', 'failed'],
    default: 'created'
  },
  feeDetails: [{
    feeId: Number,
    category: String,
    amount: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
