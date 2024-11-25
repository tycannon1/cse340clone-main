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

// Route to display inventory items by classification
router.get("/type/:classificationId", invController.buildByClassificationId)

router.get("/detail/:inventoryId", invCont.buildDetailByInventoryId);

router.get("/", invController.managementView);


module.exports = router

