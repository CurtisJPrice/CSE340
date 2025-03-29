const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// Example route for "by classification id"
router.get("/type/:classificationId", invController.buildByClassificationId);

module.exports = router;