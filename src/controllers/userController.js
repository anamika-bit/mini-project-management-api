const pool = require("../db/index");

/**
 * Get all users
 */
const listUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY name ASC");
    res.json({ users: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { listUsers };
