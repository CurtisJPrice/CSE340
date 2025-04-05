const pool = require("../database/");
const bcrypt = require("bcryptjs");

/* ***************************
 *  Register New Account
 *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password) {
  try {
    const sql =
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *";
    return await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_password,
    ]);
  } catch (error) {
    console.error("Error registering account:", error);
    return error.message;
  }
}

/* ***************************
 *  Check Existing Email
 *************************** */
async function checkExistingEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const email = await pool.query(sql, [account_email]);
    return email.rowCount;
  } catch (error) {
    console.error("Error checking email:", error);
    return error.message;
  }
}

/* ***************************
 *  Find User By Email
 *************************** */
async function findUserByEmail(account_email) {
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1";
    const result = await pool.query(sql, [account_email]);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user:", error);
    return null;
  }
}

module.exports = { registerAccount, checkExistingEmail, findUserByEmail };