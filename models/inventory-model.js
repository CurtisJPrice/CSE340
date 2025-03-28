const { Pool } = require('pg');  // Importing the PostgreSQL client (pg)

// Initialize connection to the database using environment variables
const db = new Pool({
  connectionString: process.env.DATABASE_URL,  // The connection string will come from the environment variable
  ssl: { rejectUnauthorized: false }  // Enable SSL for cloud hosting like Render
});

const inventoryModel = {};

// Function to register a new classification
inventoryModel.registerClassification = async (classification_name) => {
  const result = await db.query(
    "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id",  // SQL Query to insert a new classification
    [classification_name]  // Using the parameterized value for classification name to avoid SQL injection
  );
  return result.rows[0];  // Return the classification ID that was inserted
};

// Function to register a new vehicle
inventoryModel.registerVehicle = async (
  classification_id, inv_make, inv_model, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
) => {
  const result = await db.query(
    "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) " +
    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id",  // SQL Query to insert a new vehicle
    [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]  // Using parameters to avoid SQL injection
  );
  return result.rows[0];  // Return the vehicle ID that was inserted
};

// Function to get all classifications (to use in views like navigation)
inventoryModel.getClassifications = async () => {
  const result = await db.query(
    "SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name"  // SQL Query to get classifications from the database
  );
  return result.rows;  // Return all rows from the classification table
};

module.exports = inventoryModel;  // Export the model for use in other parts of the app