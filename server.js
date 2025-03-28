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
const pool = require('./database/');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

/* ***********************
 * Redis Client Setup (for session storage)
 *************************/
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST, // Set Redis host in your .env file
  port: process.env.REDIS_PORT, // Set Redis port (default is 6379)
  password: process.env.REDIS_PASSWORD, // Optional, set Redis password if required
});

redisClient.on('connect', function () {
  console.log('Connected to Redis');
});

redisClient.on('error', function (err) {
  console.log('Redis connection error: ', err);
});

/* ***********************
 * Middleware for Redis Session Store
 *************************/
app.use(session({
  store: new RedisStore({ client: redisClient }),  // Switch to Redis store for production
  secret: process.env.SESSION_SECRET || 'your-strong-secret-key',  // Use a real, secure secret key
  resave: false,
  saveUninitialized: true,
}));

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
// Single view route
app.use("/inv", singleViewRoute);
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
  let message = (err.status === 500) ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
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
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});