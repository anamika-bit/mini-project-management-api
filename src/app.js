const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

// Users
const userRoutes = require("./routes/userRoutes");
app.use("/users", userRoutes);

// Projects
const projectRoutes = require("./routes/projectRoutes");
app.use("/projects", projectRoutes);

const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);

// Health check
app.get("/health", (req, res) => res.json({ status: "OK" }));

module.exports = app;

