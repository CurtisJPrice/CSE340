const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const bodyParser = require("body-parser");
const env = require("dotenv").config();
const session = require("express-session");
const flash = require("connect-flash");

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
  saveUninitialized: true,
  cookie: { secure: false } 
}));

// 🔹 Flash Messages Middleware
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
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
    let nav = await utilities.getNav(); // Assuming this function gets your navigation data
    res.render("index", { title: "Home", nav }); // Pass 'nav' here
  } catch (err) {
    next(err);
  }
});

app.use("/inv", inventoryRoute);
app.use("/single", singleViewRoute);  // ✅ Prevents overlap with inventoryRoute
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
  
  const message = err.status === 404 ? err.message 
                  : "Oh no! There was a crash. Maybe try a different route?";
  
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