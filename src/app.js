const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Users
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Projects
const projectRoutes = require("./routes/projectRoutes");
app.use("/projects", projectRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

module.exports = app;

