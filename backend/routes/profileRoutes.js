const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile
} = require("../controllers/profileController");

const { protect } = require("../middleware/authMiddleware");

// GET /api/profile
router.get("/", protect, getProfile);

// PUT /api/profile
router.put("/", protect, updateProfile);

module.exports = router;
