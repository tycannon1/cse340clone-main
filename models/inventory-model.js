const pool = require("../database/");

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("Error in getInventoryByClassificationId: " + error);
    throw error;
  }
}

async function getVehicleByInventoryId(inventoryId) {
  try {
    const result = await pool.query(
      "SELECT * FROM public.inventory WHERE inv_id = $1",
      [inventoryId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("Error in getVehicleByInventoryId: " + error);
    throw error;
  }
}

async function addClassification(classificationName) {
  const sql = `INSERT INTO classification (classification_name) VALUES ($1) RETURNING *`;
  try {
    const result = await pool.query(sql, [classificationName]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error in addClassification: " + error);
    throw error;
  }
}

async function addInventoryItem(vehicle) {
  const sql = `
    INSERT INTO inventory (classification_id, make, model, year, description, price, miles, color, image, thumbnail)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING inv_id;
  `;
  const params = [
    vehicle.classification_id,
    vehicle.make,
    vehicle.model,
    vehicle.year,
    vehicle.description,
    vehicle.price,
    vehicle.miles,
    vehicle.color,
    vehicle.image,
    vehicle.thumbnail,
  ];

  try {
    const result = await pool.query(sql, params);
    return result.rows[0];
  } catch (error) {
    console.error("Error in addInventoryItem: " + error);
    throw error;
  }
}

module.exports = { getClassifications, getInventoryByClassificationId, getVehicleByInventoryId, addClassification, addInventoryItem };
