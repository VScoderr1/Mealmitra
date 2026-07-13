// Run with: npm run seed
// Creates an admin account and a set of sample tiffin plans.
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("../config/db");
const User = require("../models/User");
const TiffinPlan = require("../models/TiffinPlan");

const samplePlans = [
  { title: "Classic Breakfast", description: "Poha, tea, and fresh fruit", mealType: "Breakfast", duration: "Daily", price: 60 },
  { title: "Weekly Breakfast Combo", description: "7 days of varied breakfast", mealType: "Breakfast", duration: "Weekly", price: 380 },
  { title: "Monthly Breakfast Saver", description: "30 days breakfast plan", mealType: "Breakfast", duration: "Monthly", price: 1400 },
  { title: "Homely Lunch Thali", description: "2 sabzi, dal, rice, roti, salad", mealType: "Lunch", duration: "Daily", price: 90 },
  { title: "Weekly Lunch Plan", description: "7 days lunch thali", mealType: "Lunch", duration: "Weekly", price: 580 },
  { title: "Monthly Lunch Plan", description: "30 days lunch thali", mealType: "Lunch", duration: "Monthly", price: 2100 },
  { title: "Light Dinner Box", description: "Roti, sabzi, curd", mealType: "Dinner", duration: "Daily", price: 80 },
  { title: "Weekly Dinner Plan", description: "7 days dinner box", mealType: "Dinner", duration: "Weekly", price: 520 },
  { title: "Monthly Dinner Plan", description: "30 days dinner box", mealType: "Dinner", duration: "Monthly", price: 1900 },
];

const seed = async () => {
  await connectDB();

  const adminEmail = process.env.ADMIN_EMAIL || "admin@mealmitra.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin@12345";

  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: "MealMitra Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log(`Admin account created: ${adminEmail} / ${adminPassword}`);
  } else {
    console.log("Admin account already exists, skipping.");
  }

  const planCount = await TiffinPlan.countDocuments();
  if (planCount === 0) {
    await TiffinPlan.insertMany(samplePlans);
    console.log(`Inserted ${samplePlans.length} sample tiffin plans.`);
  } else {
    console.log("Tiffin plans already exist, skipping.");
  }

  console.log("Seeding complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
