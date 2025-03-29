// inventoryRoute.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController"); // Import the userController

// Route to display the "My Account" page
router.get("/my-account", async (req, res, next) => {
    try {
        const user = req.user || {};  // Replace with actual logic for fetching user info
        res.render("account", { title: "My Account", user });
    } catch (error) {
        console.error("Error fetching account data:", error);
        next(error); // Pass error to global error handler
    }
});

// Use the userController function to get user info
router.get("/user-info", userController.getUser); // Use the getUser function from userController

// Route to display login page (example)
router.get("/login", (req, res) => {
    res.render("login", { title: "Login" }); // Ensure you have a 'login.ejs' file
});

// Example: Add a route to handle POST login submission
router.post("/login", (req, res, next) => {
    // Example: Handle login (use actual authentication logic)
    const { username, password } = req.body;
    if (username === "admin" && password === "password") {
        req.session.user = { username }; // Example: Set user session
        res.redirect("/account/my-account"); // Redirect to the My Account page after login
    } else {
        req.flash("error", "Invalid credentials");
        res.redirect("/account/login");
    }
});

// Add your inventory-related routes here (for example)
router.get("/", (req, res) => {
    res.send("Inventory home page");
});

router.get("/add", (req, res) => {
    res.send("Add a new inventory item");
});

module.exports = router;