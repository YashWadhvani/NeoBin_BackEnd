const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { checkEnvVariables } = require("./utils/checkEnvVariables");
const { userRoutes } = require("./routes/userRoutes");
const { binRoutes } = require("./routes/binRoutes");

dotenv.config();

// Check required environment variables
checkEnvVariables();

const app = express();

// ✅ Enable proxy trust for Vercel to handle `X-Forwarded-For`
app.set("trust proxy", 1);

// 🔹 Security, Logging, and Rate Limiting Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ Improved Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window`
    message: "❌ Too many requests, please try again later!",
    headers: true, // Return rate limit headers
    keyGenerator: (req) => req.ip, // Ensure rate limit works correctly
});
app.use(limiter);

// 🔹 Routes
app.use("/api/v1", userRoutes);
app.use("/api/v1", binRoutes);

// ✅ MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// 🔹 Root route
app.get("/", (req, res) => {
    res.send("🚀 Backend is running on Vercel!");
});

// 🔹 List Database Collections
app.get("/collections", async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        res.json({ collections: collections.map((col) => col.name) });
    } catch (error) {
        console.error("❌ Error listing collections:", error);
        res.status(500).json({ error: "Error listing collections" });
    }
});

// 🔹 Database Health Check
app.get("/health", (req, res) => {
    const status = mongoose.connection.readyState;
    res.status(status === 1 ? 200 : 500).json({
        message: status === 1 ? "✅ Database is connected" : "❌ Database is not connected",
    });
});

// ✅ Global Error Handling Middleware
app.use((err, req, res, next) => {
    console.error("❌ Error:", err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// ✅ Graceful Shutdown
const shutdown = () => {
    mongoose.connection.close(() => {
        console.log("🔴 MongoDB disconnected due to app termination");
        process.exit(0);
    });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// ✅ Export for Vercel Deployment (NO `app.listen`)
module.exports = app;
