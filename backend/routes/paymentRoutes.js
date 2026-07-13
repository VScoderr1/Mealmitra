const express = require("express");
const { createPaymentOrder, verifyPayment, mockConfirmPayment } = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/create", protect, createPaymentOrder);
router.post("/verify", protect, verifyPayment);
router.post("/mock-confirm", protect, mockConfirmPayment);

module.exports = router;
