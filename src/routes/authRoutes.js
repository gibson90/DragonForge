// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');
const bcrypt = require("bcryptjs");

require('dotenv').config({path:'../.env'});

const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "1h" }); // Short-lived token
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET, { expiresIn: "7d" }); // Long-lived token
};

// ✅ Registration Route
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req, res) => {
    // Validate inputs
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Extract data
    const { username, password } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }

      // **🔒 Hash Password Before Storing**
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // **Save New User**
      user = new User({ username, password: hashedPassword });
      await user.save();

      // **Generate JWT Tokens**
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);

      // **Return Both Tokens for Future Authentication**
      res.status(201).json({
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username },
      });
    } catch (err) {
      console.error("Registration Error:", err.message);
      res.status(500).send("Server error");
    }
  }
);

// Login Route (Now Issues Both Tokens)
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Login request received:", req.body); // Log incoming request
    console.log("JWT: ", process.env.JWT_SECRET);

    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ msg: "Missing username or password" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("❌ Incorrect password for:", username);
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    console.log("✅ Tokens generated successfully");

    res.json({ accessToken, refreshToken, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error("🔥 Login Error:", error.message);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
});

// Refresh Token Route
router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(403).json({ msg: "Refresh token required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET);
    const newAccessToken = generateAccessToken(decoded.userId);
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ msg: "Invalid refresh token" });
  }
});

module.exports = router;
