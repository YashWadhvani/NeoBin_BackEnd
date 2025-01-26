// src/models/Bin.js
const mongoose = require("mongoose");

const binSchema = new mongoose.Schema({
  binId: { type: String, required: true },
  weight: { type: Number, required: true },
  gas_concentration: { type: String, required: true },
  adc_value: { type: Number, required: true },
  distance: { type: Number, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  timestamp: { type: String, required: true },
});

const Bin = mongoose.model("Bin", binSchema);

module.exports = Bin;
