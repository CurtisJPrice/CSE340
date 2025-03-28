const express = require("express");
const router = express.Router();
const Util = require("../utilities/");
const loginValidate = require("../utilities/login-validation");  // Import the login validation
const accountController = require("../controllers/accountController");

// Delivers Login View (Inline HTML instead of ejs view)
router.get("/login", (req, res) => {
  const errorMessage = req.flash("error")[0];  // Get the first flash error message if exists
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login</title>
      </head>
      <body>
        <h1>Login</h1>
        ${errorMessage ? `<div style="color: red;">${errorMessage}</div>` : ""}
        
        <form action="/account/login" method="POST">
          <label for="username">Username:</label>
          <input type="text" id="username" name="username" required><br><br>

          <label for="password">Password:</label>
          <input type="password" id="password" name="password" required><br><br>

          <button type="submit">Login</button>
        </form>
      </body>
    </html>
  `);
});

// Process the login attempt
router.post(
  "/login",
  loginValidate.loginRules(),  // Validate login input data (username and password)
  loginValidate.checklogData,   // Check if the login data is valid
  (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for testing (replace with DB logic later)
    const user = {
      username: "admin",
      password: "password123",  // This is the password you will compare with
    };

    // Check if the credentials are correct
    if (username === user.username && password === user.password) {
      req.session.user = user;  // Store user data in session
      return res.redirect("/profile");
    } else {
      req.flash("error", "Invalid username or password");
      return res.redirect("/account/login");
    }
  }
);

// Profile Page (after successful login)
router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/account/login");  // Redirect to login if not logged in
  }

  res.send(`
    <h1>Welcome, ${req.session.user.username}!</h1>
    <p>This is your profile page.</p>
    <a href="/account/logout">Logout</a>
  `);
});

// Handle Logout (destroy session and redirect to login page)
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/profile");
    }
    res.redirect("/account/login");
  });
});

module.exports = router;