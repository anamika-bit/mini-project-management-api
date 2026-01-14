const express = require("express");
const router = express.Router();
const bodyValidator = require("../middleware/bodyValidator");
const { registerSchema, loginSchema } = require("../validators/authValidator");
const { register, login } = require("../controllers/authController");

router.post("/register", bodyValidator(registerSchema),register);
router.post("/login", bodyValidator(loginSchema),login);

module.exports = router;
