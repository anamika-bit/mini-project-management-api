const express = require("express");
const router = express.Router();
const bodyValidator = require("../middleware/bodyValidator");
const { addProjectSchema } = require("../validators/projectValidator");
const { createProject, listProjects } = require("../controllers/projectController");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, bodyValidator(addProjectSchema),createProject);
router.get("/", authMiddleware, listProjects);

module.exports = router;
