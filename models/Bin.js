const mongoose = require("mongoose");

// BinCounter schema to keep track of the latest bin ID
const binCounterSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "binId", // We use a fixed name for the counter document
    },
    sequence_value: {
      type: Number,
      default: 0, // Start the counter from 0
    },
  },
  { timestamps: true }
);

const BinCounter = mongoose.model("BinCounter", binCounterSchema);

// Bin schema for each bin document
const binSchema = new mongoose.Schema(
  {
    binId: {
      type: String,
      unique: true,
    },
    weight: {
      type: Number,
      default: 0,
    },
    gasConcentration: {
      value: {
        type: Number,
        required: true,
      },
      category: {
        type: String,
        enum: ['No', 'Low', 'Moderate', 'High'],
        required: true,
      },
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

binSchema.pre("save", async function (next) {
  const counter = await BinCounter.findByIdAndUpdate(
    { _id: "binId" },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } 
  );

  const nextId = `B${(counter.sequence_value + 1).toString().padStart(3, "0")}`;
  this.binId = nextId;
  next();
});

const Bin = mongoose.model("Bin", binSchema);

module.exports = { Bin, BinCounter };
