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

const inventoryRoute = require('./routes/inventoryRoute'); // Declare this once
const baseController = require("./controllers/baseController");
const errorHandler = require('./middleware/errorMiddleware');
const connectFlash = require("connect-flash");
const invController = require('./controllers/invController');

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

// Classification validation middleware
const classificationValidationMiddleware = (req, res, next) => {
  const { classificationName } = req.body;
  if (!classificationName || !/^[a-zA-Z0-9]+$/.test(classificationName)) {
    req.flash('errorMessage', 'Invalid classification name');
    return res.redirect('/inv/add-classification');
  }
  next();
};

const inventoryValidationMiddleware = (req, res, next) => {
  const { name, description, price, classificationId } = req.body;

  console.log("Form data:", req.body);

  // Check if required fields are filled
  if (!name || !description || !price || !classificationId) {
    req.flash('errorMessage', 'All fields are required.');
    console.log("Validation failed, redirecting..."); // Debugging log

    return res.redirect('/inv/add-inventory');
  }

  // Optional: You can add additional validation, for example, checking if price is a valid number
  if (isNaN(price)) {
    req.flash('errorMessage', 'Price must be a valid number.');
    console.log("Price validation failed, redirecting..."); // Debugging log

    return res.redirect('/inv/add-inventory');
  }

  next();
};

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));



// Inventory routes
app.use("/inv", inventoryRoute); // Use inventoryRoute

// Account routes
const accountRoute = require("./routes/accountRoute");
app.use("/account", accountRoute);

app.get('/inv/add-inventory', (req, res) => {
  res.render('add-inventory'); // Make sure this view exists
});

// Add the middleware for the specific route in the inventory route handling
// This will now apply to the add-classification route under /inv
app.post('/inv/add-classification', classificationValidationMiddleware, (req, res) => {
  // Your logic for handling the classification add form
  // This will run only after the classification validation is successful
});

// Add Inventory Validation Middleware for the specific route
// POST route for Add Inventory
app.post('/inv/add-inventory', utilities.inventoryValidationMiddleware, (req, res) => {
  const { make, model, year, price, miles, color, image, thumbnail } = req.body;

  console.log('Form submitted to add inventory');


  // Your code to add inventory to the database
  // Example: invModel.addInventory(make, model, year, price, miles, color, image, thumbnail);

  req.flash("successMessage", "Inventory added successfully.");
  res.redirect("/inv"); // Redirect after successful addition
});






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
