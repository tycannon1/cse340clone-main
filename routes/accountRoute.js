
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation");
const utilities = require("../utilities/index");

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(), // Apply validation rules
    regValidate.checkValidationResults, // Validate and handle errors
    utilities.handleErrors(accountController.registerAccount) // Proceed to controller if valid
  );
  
  module.exports = router;

router.get("/login", accountController.buildLogin)

router.get("/register", accountController.buildRegister)

router.post('/register', accountController.registerAccount)

module.exports = router

