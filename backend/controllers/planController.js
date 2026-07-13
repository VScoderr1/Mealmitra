const TiffinPlan = require("../models/TiffinPlan");

// @desc  Get all active tiffin plans (public), optional ?mealType=Lunch filter
// @route GET /api/plans
const getPlans = async (req, res) => {
  try {
    const filter = { isActive: true };
    if (req.query.mealType) filter.mealType = req.query.mealType;
    const plans = await TiffinPlan.find(filter).sort({ mealType: 1, price: 1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get single plan
// @route GET /api/plans/:id
const getPlanById = async (req, res) => {
  try {
    const plan = await TiffinPlan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Create plan (Admin)
// @route POST /api/plans
const createPlan = async (req, res) => {
  try {
    const plan = await TiffinPlan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Update plan (Admin)
// @route PUT /api/plans/:id
const updatePlan = async (req, res) => {
  try {
    const plan = await TiffinPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc  Delete plan (Admin)
// @route DELETE /api/plans/:id
const deletePlan = async (req, res) => {
  try {
    const plan = await TiffinPlan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc  Get ALL plans including inactive (Admin)
// @route GET /api/plans/admin/all
const getAllPlansAdmin = async (req, res) => {
  try {
    const plans = await TiffinPlan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlans, getPlanById, createPlan, updatePlan, deletePlan, getAllPlansAdmin };
