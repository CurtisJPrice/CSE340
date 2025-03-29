/* ****************************************** 
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const singleViewRoute = require("./routes/singleViewRoute");
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/");
const errorRoute = require("./routes/errorRoute");
const session = require("express-session");

/* ***********************
 * Middleware
 ************************/
app.use(session({
  secret: process.env.SESSION_SECRET || "your_secret_key", // Use .env variable or fallback
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set `true` if using HTTPS
}));

const flash = require("connect-flash");
app.use(flash());

// Middleware to make flash messages available in views
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


// Process Registration
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route (ensure baseController.buildHome is an async function)
// Index route (renders the index.ejs file)
app.get("/", async (req, res, next) => {
  try {
    res.render("index"); // This renders the index.ejs file
  } catch (err) {
    next(err); // Handle any errors
  }
});


// Inventory routes
app.use("/inv", inventoryRoute);

// Single view route
app.use("/inv", singleViewRoute);

// Accounts Route
app.use("/account", accountRoute);

// Error route 
app.use("/error", errorRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 * Place after all other middleware
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 404) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

// Final catch-all error handler
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  if (err.status == 500) {
    message = err.message;
  } else {
    message = 'Oh no! There was a crash. Maybe try a different route?';
  }
  res.render("errors/error", { 
    title: err.status || 'Server Error',
    message,
    nav
  });
});

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 10000;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});