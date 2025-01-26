// src/routes/binRoutes.js
const express = require("express");
const Bin = require("../models/Bin");

const router = express.Router();

// Route to get all bins
router.get("/bins", async (req, res) => {
  try {
    // Fetch all bins from the database
    const bins = await Bin.find();
    
    // If no bins are found, return a message
    if (bins.length === 0) {
      return res.status(404).json({ message: "No bins found" });
    }

    // Return the list of bins
    res.status(200).json(bins);
  } catch (error) {
    console.error("Error fetching bins:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = {binRoutes: router};
