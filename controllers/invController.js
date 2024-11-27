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

invCont.addClassificationView = async (req, res, next) => {
  try {
    let nav = await utilities.getNav(); // Navigation bar
    res.render("./inventory/add-classification", {
      title: "Add Classification",
      nav,
      flashMessage: req.flash('flashMessage') || '',
    });
  } catch (error) {
    next(error);
  }
};

invCont.processAddClassification = async (req, res, next) => {
  const { classificationName } = req.body;
  try {
    const result = await invModel.addClassification(classificationName);
    if (result) {
      await utilities.updateNavigation(); // Refresh the navigation bar
      req.flash('flashMessage', 'Classification added successfully!');
      res.redirect("/inv/management");
    } else {
      req.flash('errorMessage', 'Failed to add classification. Please try again.');
      res.redirect("/inv/add-classification");
    }
  } catch (error) {
    next(error);
  }
};

// Display Add Inventory View
invCont.addInventoryView = async (req, res) => {
  try {
    const classificationDropdown = await utilities.buildClassificationList();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationDropdown,
      notice: req.flash("notice") // Notice message will be displayed here
    });
  } catch (error) {
    req.flash("notice", "Error loading the form. Please try again.");
    res.redirect("/inv");
  }
};


// Process Add Inventory Form Submission
invCont.processAddInventory = async (req, res) => {
  const { classification_id, make, model, year, description, price, miles, color, image, thumbnail } = req.body;

  try {
    const result = await invModel.addInventoryItem({
      classification_id,
      make,
      model,
      year,
      description,
      price,
      miles,
      color,
      image,
      thumbnail,
    });

    if (result) {
      req.flash("notice", "Vehicle added successfully!");
      res.redirect("/inv");
    } else {
      throw new Error("Failed to add inventory item.");
    }
  } catch (error) {
    req.flash("notice", "Error adding inventory item. Please check your input and try again.");
    const classificationDropdown = await utilities.buildClassificationList(classification_id);
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationDropdown,
      make,
      model,
      year,
      description,
      price,
      miles,
      color,
      image,
      thumbnail,
      notice: req.flash("notice"),
    });
  }
};




module.exports = invCont; // Export the controller functions
