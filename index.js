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

dotenv.config();

checkEnvVariables();

const PORT = process.env.PORT || 5000;

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests!",
});

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(limiter);

app.use("/api/v1/", userRoutes);

console.log(userRoutes)

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error Occured in connection:", err));

app.get("/", (req, res) => {
    res.send("Backend is running!");
});

app.get("/collections", async (req, res) => {
    try {
        const collections = await mongoose.connection.db
            .listCollections()
            .toArray();
        const collectionNames = collections.map(
            (collection) => collection.name
        ); // Extract collection names
        res.json({ collections: collectionNames });
    } catch (error) {
        console.error("Error listing collections:", error);
        res.status(500).json({ error: "Error listing collections" });
    }
});

// Database Health Check endpoint
app.get("/health", async (req, res) => {
    try {
        const status = await mongoose.connection.readyState;
        if (status === 1) {
            res.status(200).json({ message: "Database is connected" });
        } else {
            res.status(500).json({ message: "Database is not connected" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error checking database status" });
    }
});

// Global Error Handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

// Graceful shutdown
const shutdown = () => {
    mongoose.connection.close(() => {
        console.log("Mongoose connection disconnected due to app termination");
        process.exit(0);
    });
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
