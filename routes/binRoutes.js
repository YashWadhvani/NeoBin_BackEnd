// src/routes/binRoutes.js
const express = require("express");
const Bin = require("../models/Bin");

const router = express.Router();

// Helper: Group data by hour
const groupByHour = (data) => {
  return data.reduce((acc, item) => {
    const hour = new Date(item.timestamp).getHours();
    acc[hour] = acc[hour] || { hour, total: 0, count: 0 };
    acc[hour].total += item.value;
    acc[hour].count += 1;
    return acc;
  }, {});
};

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

// Route for Hourly Data
router.get("/bin/:binId/hourly", async (req,res) => {
  try {
    const {binId} = req.params;
    const bin = await Bin.findOne({binId});

    if (!bin) return res.status(400).json({error: "No Bin Found"});

    const last24Hrs = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hourlyData = bin.distance.filter((d) => d.timestamp >= last24Hrs);
    const groupedData = Object.values(groupByHour(hourlyData).map((h) => ({
      hour : `${h.hour}:00`,
      average: h.total / h.count,
    })));

    res.json(groupedData)

  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

module.exports = {binRoutes: router};
