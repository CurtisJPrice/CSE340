const { Pool } = require('pg');  // Import PostgreSQL client

const db = new Pool({
  connectionString: process.env.DATABASE_URL, // Use environment variable for remote database URL
  ssl: { rejectUnauthorized: false } // Required for remote PostgreSQL databases
});

const inventoryModel = {};

// Function to register a new classification
inventoryModel.registerClassification = async (classification_name) => {
  const result = await db.query(
    "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING classification_id",
    [classification_name]
  );
  return result.rows[0];
};

// Function to register a new vehicle
inventoryModel.registerVehicle = async (
  classification_id, inv_make, inv_model, inv_description,
  inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color
) => {
  const result = await db.query(
    "INSERT INTO public.inventory (classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color) " +
    "VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING inv_id",
    [classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color]
  );
  return result.rows[0];
};

// Function to fetch classifications (used in getNav)
inventoryModel.getClassifications = async () => {
  const result = await db.query("SELECT classification_id, classification_name FROM public.classification ORDER BY classification_name");
  return result.rows;
};

module.exports = inventoryModel;