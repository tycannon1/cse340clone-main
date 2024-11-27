// // Needed Resources 
// const express = require("express")
// const router = new express.Router() 
// const invController = require("../controllers/invController")

// // Route to build inventory by classification view
// router.get("/type/:classificationId", invController.buildByClassificationId);

// module.exports = router;

const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invCont = require("../controllers/invController");
const utilities = require('../utilities');

// Route to display inventory items by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

router.get("/detail/:inventoryId", invCont.buildDetailByInventoryId);

router.get("/", invController.managementView);

router.get("/add-classification", invController.addClassificationView);

router.post(
    "/add-classification",
    utilities.classificationValidationMiddleware,
    invController.processAddClassification
  );
  
// Display Add Inventory Form
router.get("/add-inventory", invController.addInventoryView);

// Process Add Inventory Form Submission
router.post(
  "/add-inventory",
  utilities.inventoryValidationMiddleware,
  invController.processAddInventory
);

  module.exports = router

