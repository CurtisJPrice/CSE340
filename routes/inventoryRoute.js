// routes/inventoryRoute.js

const express = require("express")
const router = express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")  // Import utilities for error handling

// Simulate routes without database queries

// Example route for "by classification id"
router.get("/type/:classificationId", async (req, res, next) => {
    try {
      await invController.buildByClassificationId(req, res, next);  // Make sure the controller method is async
    } catch (error) {
      next(error);  // Make sure to pass the error to the next middleware
    }
});

module.exports = router;