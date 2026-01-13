const pool = require("../db/index");

/**
 * Create Task under a Project
 */
const createTask = async (req, res) => {
  try {
    const { project_id, title, description, assigned_to } = req.body;

    if (!project_id || !title) {
      return res.status(400).json({ error: "project_id and title are required" });
    }

    // Optional: assigned_to validation
    if (assigned_to) {
      const userCheck = await pool.query("SELECT id FROM users WHERE id=$1", [assigned_to]);
      if (userCheck.rows.length === 0)
        return res.status(400).json({ error: "Assigned user does not exist" });
    }

    // Call stored procedure
    const result = await pool.query(
      "SELECT create_task($1,$2,$3,$4) AS id",
      [project_id, title, description || "", assigned_to || null]
    );

    res.status(201).json({ task_id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * Add Comment to Task
 */
const addComment = async (req, res) => {
  try {
    const task_id = req.params.id;
    const user_id = req.user.id; // from JWT
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: "Message is required" });

    // Validate task exists
    const taskCheck = await pool.query("SELECT id FROM tasks WHERE id=$1", [task_id]);
    if (taskCheck.rows.length === 0)
      return res.status(404).json({ error: "Task not found" });

    // Call stored procedure
    const result = await pool.query(
      "SELECT add_comment($1,$2,$3) AS id",
      [task_id, user_id, message]
    );

    res.status(201).json({ comment_id: result.rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/**
 * List Tasks with Filters & Pagination
 */
const listTasks = async (req, res) => {
  try {
    const { project_id, status, assigned_to, page = 1, limit = 10 } = req.query;

    let query = `
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.created_at,
        json_build_object('id', u.id, 'name', u.name, 'email', u.email) AS assigned_user,
        json_build_object('id', p.id, 'name', p.name, 'description', p.description) AS project,
        (
          SELECT json_agg(json_build_object('id', c.id, 'user_id', c.user_id, 'message', c.message, 'created_at', c.created_at))
          FROM comments c
          WHERE c.task_id = t.id
          ORDER BY c.created_at DESC
          LIMIT 1
        ) AS latest_comment
      FROM tasks t
      LEFT JOIN users u ON u.id = t.assigned_to
      LEFT JOIN projects p ON p.id = t.project_id
      WHERE 1=1
    `;

    const values = [];
    let idx = 1;

    if (project_id) {
      query += ` AND t.project_id = $${idx}`;
      values.push(project_id);
      idx++;
    }
    if (status) {
      query += ` AND t.status = $${idx}`;
      values.push(status);
      idx++;
    }
    if (assigned_to) {
      query += ` AND t.assigned_to = $${idx}`;
      values.push(assigned_to);
      idx++;
    }

    query += ` ORDER BY t.created_at DESC LIMIT $${idx} OFFSET $${idx + 1}`;
    values.push(parseInt(limit), (parseInt(page) - 1) * parseInt(limit));

    const result = await pool.query(query, values);

    res.json({ tasks: result.rows, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { createTask, addComment, listTasks };
