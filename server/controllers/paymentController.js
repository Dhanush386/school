const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');

// We will use test keys if env vars are not set
// In a real scenario, these should be inside the .env file.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourTestSecretKeyHere123',
});

// @desc    Create a new Razorpay Order
// @route   POST /api/payment/create-order
// @access  Public (Should be private in production)
const createOrder = async (req, res) => {
  const { amount, feeDetails, studentId, studentName } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid amount' });
  }

  const options = {
    amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
    currency: 'INR',
    receipt: 'receipt_order_' + Math.floor(Math.random() * 1000000)
  };

  try {
    const order = await razorpay.orders.create(options);

    // Save order details to DB as 'created'
    await Payment.create({
      studentId: studentId || 'anonymous',
      studentName: studentName || 'Unknown Student',
      razorpayOrderId: order.id,
      amount,
      feeDetails: feeDetails || []
    });

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourTestKeyHere123'
    });
  } catch (error) {
    console.error('Razorpay create order error:', error);
    res.status(500).json({ success: false, message: 'Something went wrong while creating order' });
  }
};

// @desc    Verify Razorpay Payment Signature
// @route   POST /api/payment/verify
// @access  Public
const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Missing payment details' });
  }

  // Create HMAC SHA256 using the order_id and payment_id concatenated with '|'
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'YourTestSecretKeyHere123')
    .update(body.toString())
    .digest('hex');

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Payment is successful
    try {
      // Find the payment record in DB and update it
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { 
          razorpayPaymentId: razorpay_payment_id, 
          razorpaySignature: razorpay_signature,
          status: 'successful'
        }
      );

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully'
      });
    } catch (dbError) {
      console.error('Error updating payment in DB:', dbError);
      // We still return success to frontend since payment succeeded at Razorpay
      res.status(200).json({ success: true, message: 'Payment verified but DB update failed' });
    }
  } else {
    // Payment failed or is fraudulent
    try {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: 'failed' }
      );
    } catch (e) {}

    res.status(400).json({
      success: false,
      message: 'Invalid signature. Payment verification failed'
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment
};
