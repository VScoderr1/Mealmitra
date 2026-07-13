const mongoose = require("mongoose");

const tiffinPlanSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mealType: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner"],
      required: true,
    },
    duration: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly"],
      required: true,
    },
    price: { type: Number, required: true },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TiffinPlan", tiffinPlanSchema);
