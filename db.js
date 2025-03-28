// Import the Pool class from the pg module
const { Pool } = require("pg");

// Create a new instance of Pool (database connection pool)
const pool = new Pool({
  // Use the environment variable DATABASE_URL to get the connection string
  connectionString: process.env.DATABASE_URL,  // This will come from Render's environment variables
  ssl: {
    rejectUnauthorized: false,  // Enabling SSL to connect to PostgreSQL in cloud environments
  },
});

// Export the pool instance so it can be used in other parts of your app
module.exports = pool;