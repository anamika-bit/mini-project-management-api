const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",      // use "db" in docker-compose
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "project_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "root",
});

// Test connection
pool
  .query("SELECT 1")
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.error("PostgreSQL connection error:", err));

module.exports = pool;

