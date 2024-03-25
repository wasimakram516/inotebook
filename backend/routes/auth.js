require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

// Route 1: Create a user using POST: "/api/auth/createUser". No login Required
router.post(
  "/createUser",
  [
    // Validation middleware to ensure that the request body contains valid data
    body("name", "Enter a valid name.").isLength({ min: 3 }),
    body("email", "Enter a valid email.").isEmail(),
    body("password", "Please enter a strong password.")
      .isLength({ min: 8 })
      .isStrongPassword(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // Check if user already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ msg: "Sorry, a user with this email already exists." });
      }

      // Hash the password before saving the user to the database
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Create the user in the database
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      // Prepare the user data for the JWT
      const data = {
        user: {
          id: user.id, // Use the user's unique identifier in the JWT payload
        },
      };

      // Sign the JWT with the secret key
      const authToken = jwt.sign(data, JWT_SECRET);

      // Send the authToken to the client
      res.json({ authToken });
    } catch (error) {
      // Log and send server errors
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route 3: Validate a user using POST: "/api/auth/login". No login Required
router.post(
  "/login",
  [
    // Validation middleware to ensure that the request body contains valid data
    body("email", "Enter a valid email.").isEmail(),
    body("password", "Password can't be empty.").exists(),
  ],
  async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      // Check email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ msg: "Wrong credentials." });
      }

      // Check password
      let comparedPassword = await bcrypt.compare(password, user.password);
      if (!comparedPassword) {
        return res.status(401).json({ msg: "Wrong credentials." });
      }

      // Prepare the user data for the JWT
      const data = {
        user: {
          id: user.id, // Use the user's unique identifier in the JWT payload
        },
      };

      // Sign the JWT with the secret key
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: "1h" }); // Token expires in 1 hour

      // Send the authToken to the client
      res.json({ authToken });
    } catch (error) {
      // Log and send server errors
      console.error(error.message);
      res.status(500).send("Server error");
    }
  }
);

// Route 3: Get logged-in user details using POST: "/api/auth/getUser". Login Required
router.post("/getUser", fetchUser, async (req, res) => {
  try {
    const userID = req.user.id;
    const user = await User.findById(userID).select("-password");
    res.json(user);
  } catch (error) {
    // Log and send server errors
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
