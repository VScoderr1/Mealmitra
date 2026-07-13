const crypto = require("crypto");
const Order = require("../models/Order");
const sendEmail = require("../utils/sendEmail");

let razorpayInstance = null;
const isRazorpayConfigured = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET;

if (isRazorpayConfigured) {
  const Razorpay = require("razorpay");
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc  Create a payment order (Razorpay if configured, else mock)
// @route POST /api/payments/create
const createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (isRazorpayConfigured) {
      const razorpayOrder = await razorpayInstance.orders.create({
        amount: Math.round(order.amount * 100), // paise
        currency: "INR",
        receipt: `receipt_order_${order._id}`,
      });
      order.razorpayOrderId = razorpayOrder.id;
      order.paymentMode = "Razorpay";
      await order.save();

      return res.json({
        mode: "razorpay",
        keyId: process.env.RAZORPAY_KEY_ID,
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        orderId: order._id,
      });
    }

    // Mock mode - no Razorpay keys configured, simulate a payment gateway
    order.paymentMode = "Mock";
    await order.save();
    return res.json({
      mode: "mock",
      amount: order.amount,
      orderId: order._id,
      message: "Razorpay keys not configured - using built-in mock payment flow.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Verify Razorpay payment signature
// @route POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const order = await Order.findById(orderId).populate("userId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      order.paymentStatus = "Failed";
      await order.save();
      return res.status(400).json({ message: "Payment verification failed" });
    }

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();

    sendEmail({
      to: order.userId.email,
      subject: "Payment Successful - MealMitra",
      html: `<p>Hi ${order.userId.name}, your payment of Rs. ${order.amount} was successful. Your ${order.mealType} plan is now confirmed.</p>`,
    }).catch((e) => console.log(e.message));

    res.json({ message: "Payment verified successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Confirm mock payment (used when Razorpay keys are absent)
// @route POST /api/payments/mock-confirm
const mockConfirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId).populate("userId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "Paid";
    order.orderStatus = "Confirmed";
    order.paymentMode = "Mock";
    await order.save();

    sendEmail({
      to: order.userId.email,
      subject: "Payment Successful (Mock) - MealMitra",
      html: `<p>Hi ${order.userId.name}, your mock payment of Rs. ${order.amount} was successful. Your ${order.mealType} plan is now confirmed.</p>`,
    }).catch((e) => console.log(e.message));

    res.json({ message: "Mock payment confirmed", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createPaymentOrder, verifyPayment, mockConfirmPayment };
