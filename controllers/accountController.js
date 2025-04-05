const bcrypt = require("bcryptjs");
const accountModel = require("../models/account-model");

/* ***************************
 *  Show Login Page
 *************************** */
const showLogin = (req, res) => {
  res.render("account/login", { 
    title: "Login", 
    messages: req.flash(), 
    locals: {} 
  });
};

/* ***************************
 *  Show Register Page
 *************************** */
const showRegister = (req, res) => {
  res.render("account/register", { 
    title: "Register", 
    messages: req.flash(), 
    locals: {} 
  });
};

/* ***************************
 *  Handle User Registration
 *************************** */
const register = async (req, res) => {
  const { account_firstname, account_lastname, account_email, account_password } = req.body;

  try {
    // Check if email already exists
    const existingUser = await accountModel.checkExistingEmail(account_email);
    if (existingUser > 0) {
      req.flash("error", "Email already in use.");
      return res.redirect("/account/register");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(account_password, 10);

    // Register User
    await accountModel.registerAccount(account_firstname, account_lastname, account_email, hashedPassword);

    req.flash("success", "Registration successful! Please log in.");
    res.redirect("/account/login");
  } catch (error) {
    console.error("Registration error:", error);
    req.flash("error", "Something went wrong. Try again.");
    res.redirect("/account/register");
  }
};

/* ***************************
 *  Handle User Login
 *************************** */
const login = async (req, res) => {
  const { account_email, account_password } = req.body;

  try {
    // Find User
    const user = await accountModel.findUserByEmail(account_email);
    if (!user) {
      req.flash("error", "Invalid credentials.");
      return res.redirect("/account/login");
    }

    // Check Password
    const validPassword = await bcrypt.compare(account_password, user.account_password);
    if (!validPassword) {
      req.flash("error", "Invalid credentials.");
      return res.redirect("/account/login");
    }

    // Store Session
    req.session.user = {
      id: user.account_id,
      firstname: user.account_firstname,
      lastname: user.account_lastname,
      email: user.account_email,
    };

    req.flash("success", "Login successful!");
    res.redirect("/");
  } catch (error) {
    console.error("Login error:", error);
    req.flash("error", "Something went wrong. Try again.");
    res.redirect("/account/login");
  }
};

module.exports = { showLogin, showRegister, register, login };