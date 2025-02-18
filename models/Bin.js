const mongoose = require("mongoose");

const readingSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  value: { type: Number, required: true },
});

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true, unique: true },
  weight: [readingSchema],  // Stores weight readings over time
  gas_concentration: [readingSchema],  // Stores gas concentration readings
  distance: [readingSchema],  // Stores distance readings
  
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
});

const Bin = mongoose.model("Bin", binSchema);
module.exports = Bin;
