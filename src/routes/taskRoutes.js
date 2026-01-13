const express = require("express");
const router = express.Router();
const { createTask, addComment, listTasks } = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");

// Protected routes
router.post("/", authMiddleware, createTask);
router.post("/:id/comments", authMiddleware, addComment);
router.get("/", authMiddleware, listTasks);

module.exports = router;
