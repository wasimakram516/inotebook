const express = require("express");
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const errorHandler = require("../utils/errorHandler");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: Validate a user using POST: "/api/auth/createuser". No login Required
router.post("/createuser", [
  body("name", "Name must be at least 3 characters long.").isLength({ min: 5 }),
  body("email", "Please enter a valid email address.").isEmail(),
  body("password", "Password must be strong and at least 8 characters long.").isLength({ min: 8 }),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorHandler(res, 400, errors.array().map(err => err.msg).join('. '));
  }

  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) return errorHandler(res, 400, "User with this email already exists.");

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    user = new User({ name: req.body.name, email: req.body.email, password: hashedPassword });
    await user.save();

    const payload = { user: { id: user.id }};
    const authToken = jwt.sign(payload, JWT_SECRET);

    res.json({ authToken });
  } catch (error) {
    errorHandler(res, 500, "Failed to create user.");
  }
});

// Route 2: Validate a user using POST: "/api/auth/login". No login Required
router.post("/login", [
  body("email", "Please enter a valid email address.").isEmail(),
  body("password", "Password cannot be empty.").exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorHandler(res, 400, errors.array().map(err => err.msg).join('. '));
  }

  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      return errorHandler(res, 400, "Invalid Credentials");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorHandler(res, 400, "Invalid Credentials");
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(payload, JWT_SECRET);
    res.json({ authToken });
  } catch (error) {
    console.error(error.message);
    errorHandler(res, 500, "Server error");
  }
});


// Route 3: Get logged-in user details using POST: "/api/auth/getUser". Login Required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude the password from the result
    res.json(user);
  } catch (error) {
    console.error(error.message);
    errorHandler(res, 500, "Server error");
  }
});


module.exports = router;
