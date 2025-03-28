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
const env = require("dotenv").config();  // Loads environment variables from .env file
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const singleViewRoute = require("./routes/singleViewRoute");  // Ensure the new route is used
const accountRoute = require("./routes/accountRoute");
const utilities = require("./utilities/");  // Utility functions
const errorRoute = require("./routes/errorRoute");
const session = require("express-session");

/* ***********************
 * Middleware
 ************************/
app.use(session({
  secret: process.env.SESSION_SECRET,  // Ensure SESSION_SECRET is set in the environment (Render, or .env locally)
  resave: true,  // Forces the session to be saved even if it wasn't modified
  saveUninitialized: true,  // Save sessions that are uninitialized
  name: 'sessionId',  // Cookie name for session ID
}))

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
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
// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));
// Inventory routes
app.use("/inv", inventoryRoute);
// Single view route for vehicle details
app.use("/inv", singleViewRoute);  // Add this route for vehicle details
// Accounts Route
app.use("/account", accountRoute);
// Error route 
app.use("/error", errorRoute);
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'});
});

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status == 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  });
});

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message = err.status == 500 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
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
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});