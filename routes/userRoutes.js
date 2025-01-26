// src/routes/userRoutes.js
const express = require("express");
const {
    signup,
    login,
    protectedRoute,
    updateUser,
} = require("../controllers/userController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Define routes and attach controllers
router.post("/signup", signup);
router.post("/login", login);
router.get("/protected", authenticateToken, protectedRoute);
router.put("/update", authenticateToken, updateUser);

module.exports = { userRoutes: router };
