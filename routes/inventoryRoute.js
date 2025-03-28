const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route for vehicle management view
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build add classification page
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to build add vehicle page
router.get("/add-vehicle", utilities.handleErrors(invController.buildAddVehicle));

// Process new classification addition
router.post("/add-classification", utilities.handleErrors(invController.newClassification));

// Process new vehicle addition
router.post("/add-vehicle", utilities.handleErrors(invController.newVehicle));

module.exports = router;