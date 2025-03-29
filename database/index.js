const { Pool } = require('pg');  // Using PostgreSQL
// Or use `mysql2` for MySQL connection
// const mysql = require('mysql2');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Remote DB connection string
  ssl: {
    rejectUnauthorized: false,  // For hosted databases (e.g., Heroku)
  }
});

module.exports = pool;