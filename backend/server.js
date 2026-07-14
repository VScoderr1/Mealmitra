const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const dns = require("node:dns");

dotenv.config();

dns.setServers(["1.1.1.1", "1.0.0.1"]);

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const planRoutes = require("./routes/planRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Routes
app.get("/api/health", (req, res) => res.json({ status: "OK", message: "MealMitra API running" }));
app.use("/api/auth", authRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MealMitra server running on port ${PORT}`));
