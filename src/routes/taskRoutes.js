const express = require("express");
const router = express.Router();
const bodyValidator = require("../middleware/bodyValidator");
const { createTaskSchema,assignTaskSchema, addCommentSchema,listTasksSchema, updateTaskStatusSchema } = require("../validators/taskValidator");
const { createTask, addComment, listTasks, assignTask, updateTaskStatus } = require("../controllers/taskController");
const authMiddleware = require("../middleware/auth");

// Protected routes
router.post("/", authMiddleware,  bodyValidator(createTaskSchema),createTask);
router.post("/:id/comments", authMiddleware, bodyValidator(addCommentSchema),addComment);
router.get("/", authMiddleware, bodyValidator(listTasksSchema),listTasks);
router.put("/:id/assign", authMiddleware, bodyValidator(assignTaskSchema),assignTask);
router.patch("/:id/status",authMiddleware,bodyValidator(updateTaskStatusSchema),updateTaskStatus);

module.exports = router;
