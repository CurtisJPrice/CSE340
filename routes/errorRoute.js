// routes/errorRoute.js

const express = require("express");
const router = express.Router();
const utilities = require("../utilities/"); // Assuming utilities.js has async functions like getNav()

/* ***************************
 * General Error Route
 ***************************/
router.get("/", async (req, res, next) => {
try {
    // Asynchronously retrieve any necessary data for the error page
    const nav = await utilities.getNav(); // Ensure this async function is awaited

    // Render the error page with data (this can vary based on your structure)
    res.render("errors/error", {
      title: "Error", // Title of the error page
      message: "Sorry, we appear to have lost that page.", // Generic error message
      nav, // Pass nav data to the view
    });
} catch (err) {
    // Handle any errors that may occur when processing the route
    next(err); // Pass the error to the next middleware or error handler
}
});

/* ***************************
 * 404 Not Found Error Route
 ***************************/
router.use(async (req, res, next) => {
try {
    const nav = await utilities.getNav(); // Ensure this async function is awaited
    next({
    status: 404,
      message: "Sorry, we appear to have lost that page.", // Custom 404 message
    });
} catch (err) {
    next(err); // Pass the error to the next middleware or error handler
}
});

/* ***************************
 * Catch-all Error Handler (for any errors)
 ***************************/
router.use(async (err, req, res, next) => {
try {
    const nav = await utilities.getNav(); // Ensure this async function is awaited

    // Log the error details for debugging (you can replace this with a proper logger)
    console.error(`Error at "${req.originalUrl}": ${err.message}`);

    // Render the generic error page or a custom one depending on the error
    res.render("errors/error", {
      title: err.status || "Server Error", // Use custom error status or fallback to "Server Error"
      message: err.status === 404 ? err.message : "Oops! Something went wrong.", // Display error message
      nav, // Pass nav data to the view
    });
} catch (err) {
    // Handle any errors that might occur within the error handler itself
    res.status(500).render("errors/error", {
    title: "Server Error",
    message: "An unexpected error occurred, please try again later.",
      nav: [], // Fallback empty nav if another error happens
    });
}
});

module.exports = router;