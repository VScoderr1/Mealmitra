const express = require("express");
const {
  getPlans,
  getPlanById,
  createPlan,
  updatePlan,
  deletePlan,
  getAllPlansAdmin,
} = require("../controllers/planController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/", getPlans);
router.get("/admin/all", protect, admin, getAllPlansAdmin);
router.get("/:id", getPlanById);
router.post("/", protect, admin, createPlan);
router.put("/:id", protect, admin, updatePlan);
router.delete("/:id", protect, admin, deletePlan);

module.exports = router;
