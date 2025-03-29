const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");

// Login Page
router.get("/login", accountController.showLogin);

// Register Page
router.get("/register", accountController.showRegister);

// Process Login
router.post("/login", accountController.login);

// Process Registration
router.post("/register", accountController.register);

module.exports = router;