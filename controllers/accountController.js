// Require the utilities module
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
  

module.exports = { buildLogin }

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
  
  module.exports = { buildLogin, buildRegister }