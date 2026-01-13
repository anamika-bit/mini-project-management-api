const express = require("express");
const router = express.Router();
const { listUsers } = require("../controllers/userController");
const authMiddleware = require("../middleware/auth");

// Protected route
router.get("/", authMiddleware, listUsers);

module.exports = router;
