const express = require("express");
const router = express.Router();
const Util = require("../utilities/");
const loginValidate = require("../utilities/login-validation");
const accountController = require("../controllers/accountController");

// ✅ Login View (Now Uses EJS)
router.get("/login", (req, res) => {
  const errorMessage = req.flash("error")[0];
  res.render("login", { title: "Login", errorMessage }); 
});

// ✅ Process Login Attempt
router.post(
  "/login",
  loginValidate.loginRules(), 
  loginValidate.checklogData, 
  (req, res) => {
    const { username, password } = req.body;

    // Hardcoded credentials for testing (replace with DB logic later)
    const user = { username: "admin", password: "password123" };

    if (username === user.username && password === user.password) {
      req.session.user = user;
      return res.redirect("/account/profile");
    } else {
      req.flash("error", "Invalid username or password");
      return res.redirect("/account/login");
    }
  }
);

// ✅ Profile Page
router.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/account/login");
  }
  res.render("profile", { title: "Profile", user: req.session.user });
});

// ✅ Handle Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/account/profile");
    }
    res.redirect("/account/login");
  });
});

module.exports = router;