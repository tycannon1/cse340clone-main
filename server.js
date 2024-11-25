/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const db = require('./config/db'); // Add this line for database connection
const app = express();
const static = require("./routes/static");
const session = require("express-session");
const pool = require('./database/');
const utilities = require('./utilities');
const bodyParser = require("body-parser");

const inventory = require('./routes/inventoryRoute');
const baseController = require("./controllers/baseController");
const errorHandler = require('./middleware/errorMiddleware');
const connectFlash = require("connect-flash");


/* ***********************
 * Serve Static Files
 *************************/
app.use(express.static("public"));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Middleware
 ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}));

// Flash Messages Middleware
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash('notice');  // Use flash messages
  next();
});

// Body parser middleware (Express 4.16+)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

/* ***********************
 * Routes
 *************************/
app.use(static);
const inventoryRoute = require('./routes/inventoryRoute');
const accountRoute = require("./routes/accountRoute");

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
app.use("/account", accountRoute);

// File Not Found Route - must be last route in list
app.use((req, res, next) => {
  next({ status: 404, message: 'Sorry, we appear to have lost that page.' });
});

/* ***********************
 * Express Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  try {
    let nav = await utilities.getNav();
    console.error(`Error at: "${req.originalUrl}": ${err.message}`);
    const message = err.status === 404 ? err.message : 'Oh no! There was a crash. Maybe try a different route?';
    res.render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav,
    });
  } catch (error) {
    next(error); // Pass the error to the next middleware if rendering fails
  }
});

/* ***********************
 * Local Server Information
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`);
});
