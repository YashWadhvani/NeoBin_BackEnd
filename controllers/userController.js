// src/controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Signup Controller
const signup = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).send("User created");
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }
  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send("Invalid login credentials");
    }
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid login credentials");
    }
  
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.send({ token });
  };

// Protected Route Controller
const protectedRoute = async (req, res) => {
  const userId = req.user.userId;
  const user = await User.findOne({ _id: `${userId}` });
  if (!user) {
    return res.status(404).send("User not found");
  }
  res.json({ message: "Protected content", user });
};

// Update User Controller
const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }
  
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).send("Invalid email format");
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = req.user.userId;
  
    const update = { name, email, password: hashedPassword };
    await User.updateOne({ _id: userId }, update);
    res.send("User updated");
  };

module.exports = { signup, login, protectedRoute, updateUser };
