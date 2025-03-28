// 1. Import the database connection
const db = require("../db");

const inventoryModel = {};

// 2. Function to register a new classification
inventoryModel.registerClassification = async (classification_name) => {
  const result = await db.query(
    "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id",
    [classification_name]
  );
  return result.rows[0];
};

// 3. Function to register a new vehicle
inventoryModel.registerVehicle = async (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) => {
  const result = await db.query(
    "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id",
    [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
  );
  return result.rows[0];
};

// 4. Function to get classifications from the database
inventoryModel.getClassifications = async () => {
  try {
    // 5. Query to fetch classifications from the database
    const result = await db.query("SELECT * FROM public.classification");
    return result; // Return the result (you can modify this if you want to structure the response differently)
  } catch (error) {
    console.error("Error fetching classifications:", error); // Error handling
    throw error;
  }
};

// 6. Export the model
module.exports = inventoryModel;