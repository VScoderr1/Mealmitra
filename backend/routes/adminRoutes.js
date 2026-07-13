const express = require("express");
const { getAllUsers, deleteUser } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/auth");

const router = express.Router();

router.get("/users", protect, admin, getAllUsers);
router.delete("/users/:id", protect, admin, deleteUser);

module.exports = router;
