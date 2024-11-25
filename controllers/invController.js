const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

// Controller functions for inventory
const invCont = {};

// Build inventory by classification view
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await invModel.getInventoryByClassificationId(classification_id);
    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error); // Pass any errors to error handling middleware
  }
};

// Build inventory detail by inventory ID
invCont.buildDetailByInventoryId = async function (req, res, next) {
  try {
    const inventory_id = req.params.inventoryId;
    const vehicle = await invModel.getVehicleByInventoryId(inventory_id);
    const detailHtml = await utilities.buildVehicleDetail(vehicle);
    const nav = await utilities.getNav();
    res.render("./inventory/detail", {
      title: `${vehicle.make} ${vehicle.model}`,
      nav,
      detailHtml,
    });
  } catch (error) {
    next(error); // Pass any errors to error handling middleware
  }
};

// Management view (for inventory management page)
invCont.managementView = async (req, res, next) => {
  try {
    const nav = await utilities.getNav(); // Get navigation menu
    const introHtml = "Welcome to the Inventory Management Page!";
    res.render("./inventory/managementView", {
      title: "Inventory Management",
      nav,
      introHtml, // Add content to display
    });
  } catch (error) {
    next(error); // Handle errors
  }
};



module.exports = invCont; // Export the controller functions
