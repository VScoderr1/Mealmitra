const Order = require("../models/Order");
const TiffinPlan = require("../models/TiffinPlan");
const sendEmail = require("../utils/sendEmail");

// @desc  Create a new order (before payment - status Pending)
// @route POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { planId, deliveryAddress } = req.body;
    const plan = await TiffinPlan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Tiffin plan not found" });

    const order = await Order.create({
      userId: req.user._id,
      planId: plan._id,
      mealType: plan.mealType,
      duration: plan.duration,
      amount: plan.price,
      deliveryAddress,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Get logged-in user's orders
// @route GET /api/orders/myorders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("planId", "title mealType duration price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single order by id (owner or admin)
// @route GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("planId");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get all orders (Admin)
// @route GET /api/orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("planId", "title mealType duration")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Update order status (Admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findById(req.params.id).populate("userId", "name email");
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();

    if (orderStatus === "Delivered") {
      sendEmail({
        to: order.userId.email,
        subject: "Your MealMitra order has been delivered",
        html: `<p>Hi ${order.userId.name}, your order for ${order.mealType} (${order.duration}) has been delivered. Enjoy your meal!</p>`,
      }).catch((e) => console.log(e.message));
    }

    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus };
