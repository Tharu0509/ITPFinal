const express = require("express");
const router = express.Router();
const User = require("../Model/SitharaUserRegModel");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, phoneNumber, password, role, farmCity, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Create new user (pre-save hook hashes password)
    const newUser = new User({ name, email, phoneNumber, password, role, farmCity, country });

    // Optional: assign lat/lon if city is Sooriyawewa
    if (farmCity?.toLowerCase() === "sooriyawewa") {
      newUser.latitude = 6.2713;
      newUser.longitude = 80.9820;
    }

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

// PROTECTED ADMIN ROUTE
router.get("/admin", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ message: "Access denied" });
  res.json({ message: "Welcome Admin", user: req.user });
});

// ADMIN LOGIN
router.post("/admin-login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: "admin" });
    if (!user) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Admin login successful",
      token,
      admin: { id: user._id, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: "Admin login failed", error: err.message });
  }
});


module.exports = router;
