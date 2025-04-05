const express = require("express");
const router = express.Router();
const pool = require("../database/");  // Import the database connection

// Route to view a specific vehicle's details
router.get("/vehicle-detail/:vehicleId", async (req, res) => {
const vehicleId = req.params.vehicleId;

try {
    // Query to fetch vehicle details by vehicleId
    const vehicleDetails = await pool.query('SELECT * FROM inventory WHERE inv_id = $1', [vehicleId]);
    
    if (vehicleDetails.rows.length > 0) {
      // Render the vehicle details page and pass the data
    res.render("vehicleDetail", { vehicle: vehicleDetails.rows[0] });
    } else {
      // If no vehicle is found, show an error
    res.status(404).send("Vehicle not found");
    }
} catch (err) {
    console.error("Error fetching vehicle details: ", err);
    res.status(500).send("Server error");
}
});

module.exports = router;
