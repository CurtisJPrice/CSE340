const { Pool } = require("pg");
require("dotenv").config();

/* ***************
 * Connection Pool
 * SSL Object needed for local testing of app
 * But will cause problems in production environment
 * If - else will make determination which to use
 * *************** */

let pool;

if (process.env.DATABASE_URL) {
  // For production or when DATABASE_URL is set
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL ? { rejectUnauthorized: false } : false,
  });
} else {
  // For local development, when DATABASE_URL is not set
  pool = new Pool({
    connectionString: 'postgres://your_username:your_password@localhost:5432/your_dbname',
  });
}

// Added for troubleshooting queries during development
module.exports = {
  async query(text, params) {
    try {
      const res = await pool.query(text, params);
      console.log("executed query", { text });
      return res;
    } catch (error) {
      console.error("error in query", { text });
      throw error;
    }
  },
};

module.exports.pool = pool; // Export the pool itself for general usage