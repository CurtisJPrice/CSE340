const express = require("express");
const router = express.Router();
const invController = require("../controllers/invController");

// ✅ Route to display vehicles by classification
router.get("/type/:classificationId", async (req, res) => {
    try {
        // Example: Fetch inventory based on classificationId
        const classificationId = req.params.classificationId;
        const inventory = await invController.getInventoryByClassification(classificationId);

        // ✅ Render the correct view (Ensure `inventory.ejs` exists in `views/inventory/`)
        res.render("inventory", { 
            title: "Inventory", 
            inventory 
        }); 
    } catch (error) {
        console.error("Error fetching inventory:", error);
        res.status(500).render("error", { title: "Error", message: "Failed to load inventory" });
    }
});

module.exports = router;