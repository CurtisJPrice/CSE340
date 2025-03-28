// database/index.js

const { Pool } = require('pg');  // PostgreSQL connection pool
require('dotenv').config();  // Load environment variables from .env file

// Set up the database connection pool using DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,  // Using the DATABASE_URL provided by cloud service (e.g., Render)
  ssl: {
    rejectUnauthorized: false,  // This is important for cloud environments like Render
  },
});

// Log when connected to the database
pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

// Error handling for the connection pool
pool.on('error', (err, client) => {
  console.error('Error in database connection', err);
});

module.exports = pool;  // Export the pool to use it in other parts of the app