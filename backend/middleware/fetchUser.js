require("dotenv").config({ path: "./.env.local" });
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const fetchUser = (req, res, next) => {
  
  // Get the user from JWT token and add id to req object

  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Please authenticate with a valid token.");
  }
  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.user;
  } catch (error) {
    res.status(401).send("Please authenticate with a valid token.");
  }
  next();
};

module.exports = fetchUser;
