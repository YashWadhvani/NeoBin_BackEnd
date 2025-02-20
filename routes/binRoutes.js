// src/routes/binRoutes.js
const express = require("express");
const Bin = require("../models/Bin");

// Importing Aggregation functions
const { getHourlyAvg, getDailyAvg, getMonthlyAvg } = require("../utils/dataAggregation");

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

// router.get("/bin/:binId/hourly", async (req, res) => {
//   try {
//     const { binId } = req.params;
//     const bin = await Bin.findOne({ binId });
//     console.log(bin)

//     if (!bin) {
//       return res.status(400).json({ error: "No Bin Found" });
//     }

//     // ✅ Check if distance, weight, and adc_value exist before using .filter()
//     const last24Hrs = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     const getHourlyAvg = (data) => {
//       if (!data || data.length === 0) return [];
    
//       // Convert timestamps properly
//       const filteredData = data.filter((d) => new Date(d.timestamp).getTime() >= last24Hrs.getTime());
//       console.log("Filtered Data:", filteredData);
    
//       if (filteredData.length === 0) return [];
    
//       const groupedData = filteredData.reduce((acc, item) => {
//         const hour = new Date(item.timestamp).getHours();
//         acc[hour] = acc[hour] || { hour, total: 0, count: 0 };
//         acc[hour].total += parseFloat(item.value); // Ensure value is a number
//         acc[hour].count += 1;
//         return acc;
//       }, {});
    
//       return Object.values(groupedData).map((h) => ({
//         hour: `${h.hour}:00`,
//         average: h.total / h.count,
//       }));
//     };
    

//     const result = {
//       distance: getHourlyAvg(bin.distance),
//       weight: getHourlyAvg(bin.weight),
//       adc_value: getHourlyAvg(bin.adc_value),
//     };

//     res.json(result);
//   } catch (error) {
//     console.error("Error in hourly data:", error);
//     res.status(500).json({ error: error.message });
//   }
// });


// Route: Hourly Aggregation
router.get("/bin/:binId/hourly", async (req, res) => {
  try {
    const { binId } = req.params;
    const bin = await Bin.findOne({ binId });

    if (!bin) return res.status(400).json({ error: "No Bin Found" });

    const result = {
      distance: getHourlyAvg(bin.distance),
      weight: getHourlyAvg(bin.weight),
      gas_value: getHourlyAvg(bin.adc_value),
    };

    res.json(result);
  } catch (error) {
    console.error("Error in hourly data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Daily Aggregation
router.get("/bin/:binId/daily", async (req, res) => {
  try {
    const { binId } = req.params;
    const bin = await Bin.findOne({ binId });

    if (!bin) return res.status(400).json({ error: "No Bin Found" });

    const result = {
      distance: getDailyAvg(bin.distance),
      weight: getDailyAvg(bin.weight),
      gas_value: getDailyAvg(bin.adc_value),
    };

    res.json(result);
  } catch (error) {
    console.error("Error in daily data:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Monthly Aggregation
router.get("/bin/:binId/monthly", async (req, res) => {
  try {
    const { binId } = req.params;
    const bin = await Bin.findOne({ binId });

    if (!bin) return res.status(400).json({ error: "No Bin Found" });

    const result = {
      distance: getMonthlyAvg(bin.distance),
      weight: getMonthlyAvg(bin.weight),
      gas_value: getMonthlyAvg(bin.adc_value),
    };

    res.json(result);
  } catch (error) {
    console.error("Error in monthly data:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = {binRoutes: router};
