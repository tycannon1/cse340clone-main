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
const db = require('./config/db'); // Database connection
const app = express();
const static = require("./routes/static");
const session = require("express-session");
const pool = require('./database/');
const utilities = require('./utilities');
const bodyParser = require("body-parser");
const connectFlash = require("connect-flash");

const inventoryRoute = require('./routes/inventoryRoute');
const baseController = require("./controllers/baseController");
const errorHandler = require('./middleware/errorMiddleware');
const invModel = require('./models/inventory-model'); // Adjust the path if necessary


/* ***********************
 * Serve Static Files
 *************************/
app.use(express.static("public"));

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // Not at views root

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply middleware explicitly for the /inv/add-inventory route
app.get('/inv/add-inventory', 
  session({ 
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  }),
  connectFlash(),
  async (req, res) => {
    console.log("GET /inv/add-inventory route hit");

    const notice = req.flash('notice');

    try {
      // Fetch classifications
      const classifications = await invModel.getClassifications();

      // Check if classifications are returned properly
      if (!classifications || !classifications.rows || classifications.rows.length === 0) {
        throw new Error("No classifications found in the database.");
      }

      // Build dropdown
      let classificationDropdown = '<select name="classification_id" id="classificationList">';
      classifications.rows.forEach(row => {
        classificationDropdown += `<option value="${row.classification_id}">${row.classification_name}</option>`;
      });
      classificationDropdown += '</select>';

      // Default form values (make, model, etc.) set from req.body or empty if new vehicle
      const make = req.body.make || '';
      const model = req.body.model || '';
      const year = req.body.year || '';
      const description = req.body.description || '';
      const price = req.body.price || '';
      const miles = req.body.miles || '';
      const color = req.body.color || '';
      const image = req.body.image || '/images/vehicles/no-image.png';
      const thumbnail = req.body.thumbnail || '/images/vehicles/no-image-thumbnail.png';

       const pageTitle = 'Add Vehicle - Inventory Management';

       const nav = await utilities.getNav();


      // Render the form with classification dropdown and other fields
      res.render('inventory/add-inventory', { 
        title: pageTitle,
        notice, 
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
        nav
      });
    } catch (error) {
      console.error('Error fetching classifications:', error);
      res.status(500).send('Error loading the page');
    }
  }
);




/* ***********************
 * Middleware
 *************************/

// Session middleware
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
  res.locals.messages = req.flash(); // Pass flash messages to views
  next();
});



/* ***********************
 * Routes
 *************************/

// Static files and default routes
app.use(static);

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome));

// Inventory routes
app.use("/inv", inventoryRoute);

// Account routes
const accountRoute = require("./routes/accountRoute");
app.use("/account", accountRoute);

// Specific route for GET /inv/add-inventory
// app.get('/inv/add-inventory', (req, res) => {
//   console.log("GET /inv/add-inventory route hit"); // Debugging log
//   const notice = req.flash('notice');
//   res.render('add-Inventory', { notice });
// });

// POST route for adding inventory
// app.post('/inv/add-inventory', utilities.inventoryValidationMiddleware, (req, res) => {
//   const { make, model, year, price, miles, color, image, thumbnail } = req.body;
//   console.log('Form submitted to add inventory');
//   req.flash("successMessage", "Inventory added successfully.");
//   res.redirect("/inv");
// });
app.post('/inv/add-inventory', async (req, res) => {
  console.log(req.body);
  try {
    // Capture form data
    const { classification_id, make, model, year, description, price, miles, color, image, thumbnail } = req.body;

    // Check if required fields are missing
    if (!make || !model || !year || !price || !miles || !color || !image || !thumbnail) {
      req.flash('notice', 'Please fill out all required fields.');
      return res.redirect('/inv/add-inventory');
    }

    // Insert the new inventory item into the database
    await invModel.addInventory(classification_id, make, model, year, description, price, miles, color, image, thumbnail);

    req.flash('notice', 'Inventory added successfully!');
    res.redirect('/inv/add-inventory');
  } catch (error) {
    console.error('Error submitting form:', error);
    res.status(500).send('Error submitting the form');
  }
});

// Classification routes
app.post('/inv/add-classification', utilities.classificationValidationMiddleware, (req, res) => {
  // Add classification logic
  res.redirect('/inv'); // Redirect to inventory page
});

// 404 Route
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
    next(error);
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
