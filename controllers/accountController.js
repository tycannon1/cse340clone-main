// Require the utilities module
const accountModel = require("../models/account-model"); 
const utilities = require("../utilities/index")

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
    try {
      let nav = await utilities.getNav()
      res.render("account/login", {
        title: "Login",  // Title is correctly passed here
        nav,
      })
    } catch (error) {
      next(error)
    }
  }
  



/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
    })
  }
  
  

  /* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
  
    try {
      const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
      );
  
      if (regResult.rowCount > 0) {  // Check if a row was actually inserted
        req.flash(
          "notice",
          `Congratulations, you’re registered, ${account_firstname}. Please log in.`
        );
        res.status(201).render("account/login", {
          title: "Login",
          nav,
        });
      } else {
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
          title: "Registration",
          nav,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      req.flash("notice", "An error occurred during registration.");
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
      });
    }
  }
  
  module.exports = { buildLogin, buildRegister, registerAccount };