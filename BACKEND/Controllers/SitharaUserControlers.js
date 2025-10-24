const User = require("../Model/SitharaUserRegModel");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // don't return passwords
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ users });
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user });
  } catch (err) {
    console.error("Get User by ID Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add user
const addUser = async (req, res) => {
  const { name, email, phoneNumber, password, role, farmCity, country } = req.body;

  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already exists" });

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    let latitude, longitude;
    if (farmCity?.toLowerCase() === "sooriyawewa") {
      latitude = 6.2713;
      longitude = 80.9820;
    }

    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      farmCity,
      country,
      latitude,
      longitude,
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: { ...newUser._doc, password: undefined } });
  } catch (err) {
    console.error("Add User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user
const updateUser = async (req, res) => {
  const id = req.params.id;
  const { name, email, phoneNumber, password, role, farmCity, country } = req.body;

  try {
    const existingUser = await User.findById(id);
    if (!existingUser) return res.status(404).json({ message: "User not found" });

    existingUser.name = name || existingUser.name;
    existingUser.email = email || existingUser.email;
    existingUser.phoneNumber = phoneNumber || existingUser.phoneNumber;
    existingUser.role = role || existingUser.role;
    existingUser.farmCity = farmCity || existingUser.farmCity;
    existingUser.country = country || existingUser.country;

    // ✅ Hash password only if it’s updated
    if (password) {
      existingUser.password = await bcrypt.hash(password, 10);
    }

    // ✅ Assign lat/lon if city is "Sooriyawewa"
    if (existingUser.farmCity?.toLowerCase() === "sooriyawewa") {
      existingUser.latitude = 6.2713;
      existingUser.longitude = 80.9820;
    } else {
      existingUser.latitude = undefined;
      existingUser.longitude = undefined;
    }

    await existingUser.save();
    res.status(200).json({ message: "User updated", user: { ...existingUser._doc, password: undefined } });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted", user: { ...user._doc, password: undefined } });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const loginUser  = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "mysecretkey",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        farmCity: user.farmCity,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  loginUser ,
};

