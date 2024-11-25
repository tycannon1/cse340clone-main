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
// async function buildRegister(req, res, next) {
//     let nav = await utilities.getNav()
//     res.render("account/register", {
//       title: "Register",
//       nav,
//       errors: null,
//     })
//   }
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav();
    const oldInput = req.flash('oldInput') || {};  // Retrieve old input if it exists
    const errors = req.flash('errors') || [];     // Retrieve any validation errors
  
    res.render("account/register", {
      title: "Register",
      nav,
      oldInput,  // Pass old input to pre-fill form fields
      errors     // Pass errors to display on the form
    });
  }
  
  

 /* ****************************************
 *  Process Registration
 * *************************************** */
// async function registerAccount(req, res) {
//     const { account_firstname, account_lastname, account_email, account_password } = req.body;

//     try {
//         const regResult = await accountModel.registerAccount(
//             account_firstname,
//             account_lastname,
//             account_email,
//             account_password
//         );

//         if (regResult.rowCount > 0) {  // Check if a row was actually inserted
//             req.flash(
//                 "notice",
//                 `Congratulations, you’re registered, ${account_firstname}. Please log in.`
//             );
//             // Redirect to the login page
//             res.redirect("/account/login");
//         } else {
//             // Stay on the register page if registration failed
//             let nav = await utilities.getNav();
//             req.flash("notice", "Sorry, the registration failed.");
//             res.status(501).render("account/register", {
//                 title: "Registration",
//                 nav,
//             });
//         }
//     } catch (error) {
//         console.error("Registration error:", error);
//         let nav = await utilities.getNav();
//         req.flash("notice", "An error occurred during registration.");
//         res.status(500).render("account/register", {
//             title: "Registration",
//             nav,
//         });
//     }
// }

async function registerAccount(req, res) {
    const { account_firstname, account_lastname, account_email, account_password } = req.body;
    let errors = [];
  
    // Simple validation example (you can enhance this)
    if (!account_firstname || !account_lastname || !account_email || !account_password) {
      errors.push("All fields are required.");
    }
  
    if (errors.length > 0) {
      // Store errors and old input in flash
      req.flash('errors', errors);
      req.flash('oldInput', req.body);
  
      // Redirect back to registration page with the errors and old input
      return res.redirect('/account/register');
    }
  
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
        // Redirect to the login page
        res.redirect("/account/login");
      } else {
        // Stay on the register page if registration failed
        let nav = await utilities.getNav();
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register", {
          title: "Registration",
          nav,
          errors: null,  // Clear errors for this failed attempt
          oldInput: req.body,  // Pass the old input in case user wants to try again
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      let nav = await utilities.getNav();
      req.flash("notice", "An error occurred during registration.");
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
        oldInput: req.body,  // Pass the data back to the form if there was an error
      });
    }
  }

  
  module.exports = { buildLogin, buildRegister, registerAccount };