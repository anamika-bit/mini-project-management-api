const pool = require("../db/index");

/**
 * Create Project
 */
const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    const owner_id = req.user.id; // from JWT

    if (!name) return res.status(400).json({ error: "Project name is required" });

    const result = await pool.query(
      "SELECT create_project($1,$2,$3) AS id",
      [name, description || "", owner_id]
    );

    res.status(201).json({ project_id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * List Projects
 */
const listProjects = async (req, res) => {
  try {
    const owner_id = req.user.id; // from JWT
    const result = await pool.query(
      "SELECT * FROM projects WHERE owner_id=$1 ORDER BY created_at DESC",
      [owner_id]
    );

    res.json({ projects: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createProject, listProjects };
