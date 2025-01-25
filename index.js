const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const bcrypt = require("bcryptjs");

dotenv.config();

const PORT = process.env.PORT || 5000

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req,res) => {
    res.send("Backend is running!")
})

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost:${PORT}`)
})