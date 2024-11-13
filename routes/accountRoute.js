
const express = require("express")
const router = express.Router()
const accountController = require("../controllers/accountController")

router.get("/login", accountController.buildLogin)

module.exports = router

router.get("/register", accountController.buildRegister)
