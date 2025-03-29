// routes/inventoryRoute.js

const express = require("express")
const router = express.Router()
const invController = require("../controllers/inventoryController")
const utilities = require("../utilities/")  // Import utilities for error handling

// Simulate routes without database queries

// Example route for "by classification id"
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

module.exports = router;