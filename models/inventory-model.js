// models/inventory-model.js

const db = require("../db"); // Assuming you're using a PostgreSQL client (e.g., pg-promise, pg)

async function getInventoryByClassificationId(classificationId) {
  const query = "SELECT * FROM inventory WHERE classification_id = $1";
  const result = await db.query(query, [classificationId]);
  return result.rows;  // Ensure you're returning the correct data structure
}

module.exports = {
  getInventoryByClassificationId
};