const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
require("dotenv").config();  // ✅ Ensures environment variables are loaded without assigning to a variable
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs"); // ✅ Will be used in authentication logic
const pool = require("./database/"); // ✅ Will be used to interact with the database

const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const singleViewRoute = require("./routes/singleViewRoute");
const errorRoute = require("./routes/errorRoute");
const utilities = require("./utilities/");

// 🔹 Session Setup
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key",
  resave: false,
  saveUninitialized: false,  // ✅ Fix: Creates session only when needed
  cookie: { secure: false, httpOnly: true } // ✅ Security improvement
}));

// 🔹 Flash Messages Middleware
app.use(flash());

app.use((req, res, next) => {
  res.locals.messages = req.flash();
  res.locals.user = req.session.user || null; // ✅ Ensures views can access logged-in user
  next();
});

// 🔹 Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 🔹 View Engine Setup
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout");

// 🔹 Routes
app.use(static);

// Example of your index route
app.get("/", async (req, res, next) => {
  try {
    let nav = await utilities.getNav();
    baseController.renderPage(req, res, "index", { title: "Home", nav });
  } catch (err) {
    next(err);
  }
});

// Example of using pool (database query)
app.get("/check-email", async (req, res, next) => {
  try {
    const emailToCheck = req.query.email;
    const result = await pool.query("SELECT * FROM account WHERE account_email = $1", [emailToCheck]);
    if (result.rowCount > 0) {
      res.send("Email already exists");
    } else {
      res.send("Email is available");
    }
  } catch (err) {
    next(err);
  }
});

// Example of using bcrypt (password hashing)
app.post("/register", async (req, res, next) => {
  const { email, password, firstName, lastName } = req.body;
  try {
    // Check if email already exists
    const existingUser = await pool.query("SELECT * FROM account WHERE account_email = $1", [email]);
    if (existingUser.rowCount > 0) {
      req.flash("error", "Email already registered");
      return res.redirect("/register");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user into the database
    await pool.query(
      "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client')",
      [firstName, lastName, email, hashedPassword]
    );

    req.flash("success", "Registration successful");
    res.redirect("/login");
  } catch (err) {
    next(err);
  }
});

// Your other routes
app.use("/inv", inventoryRoute);
app.use("/single", singleViewRoute);
app.use("/account", accountRoute);
app.use("/error", errorRoute);

// 🔹 404 Error Handler
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

// 🔹 Global Error Handler (Fixed Duplicate)
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);

  const message = err.status === 404 ? err.message : "Oh no! There was a crash. Maybe try a different route?";

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav
  });
});

// 🔹 Server Configuration
const port = process.env.PORT || 10000;
const host = process.env.HOST || 'localhost';
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});