// src/controllers/userController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Signup Controller
const signup = async (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).send("All fields are required");
    }

    try {
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).send("Email already exists");
        }
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).send("Phone Number already exists");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, phone, password: hashedPassword });
        await user.save();
        res.status(201).send("User created");
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error, please try again later");
    }
};

// Login Controller
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).send("Email and password are required");
    }

    if (!validateEmail(email)) {
        return res.status(400).send("Invalid email format");
    }

    try {
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
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error, please try again later");
    }
};

// Protected Route Controller
const protectedRoute = async (req, res) => {
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.json({ message: "Protected content", user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error, please try again later");
  }
};

// Update User Controller
const updateUser = async (req, res) => {
  const { name, email, phone, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  // Email validation
  if (!validateEmail(email)) {
    return res.status(400).send("Invalid email format");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = req.user.userId;

    const update = { name, email, phone, password: hashedPassword };

    // Update the user's information in the database
    const updatedUser = await User.updateOne({ _id: userId }, update);
    if (updatedUser.modifiedCount === 0) {
      return res.status(400).send("No changes were made");
    }

    res.send("User updated successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error, please try again later");
  }
};

module.exports = { signup, login, protectedRoute, updateUser };