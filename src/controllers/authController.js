const pool = require("../db/index");
const { hashPassword, comparePassword } = require("../utils/hash");
const { generateToken } = require("../utils/jwt");

/**
 * Register User
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields are required" });

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Call stored procedure to create user
    const result = await pool.query(
      "SELECT create_user($1, $2, $3) AS id",
      [name, email, hashedPassword]
    );

    res.status(201).json({ user_id: result.rows[0].id });
  } catch (err) {
    if (err.code === "23505") {
      // Unique violation
      return res.status(400).json({ error: "Email already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Login User
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email & password required" });

    // Fetch user
    const userRes = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    if (userRes.rows.length === 0)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = userRes.rows[0];

    // Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Generate JWT
    const token = generateToken({ id: user.id, email: user.email });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { register, login };
