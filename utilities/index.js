const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Get Navigation HTML
 ************************** */
Util.getNav = async function () {
  try {
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) => {
      list += "<li>";
      list +=
        '<a href="/inv/type/' +
        row.classification_id +
        '" title="See our inventory of ' +
        row.classification_name +
        ' vehicles">' +
        row.classification_name +
        "</a>";
      list += "</li>";
    });
    list += "</ul>";
    return list;
  } catch (error) {
    console.error('Error fetching classifications:', error);
    return '<p>Error loading navigation menu.</p>';
  }
};

/* ******************************
 * Build Classification Grid HTML
 ****************************** */
Util.buildClassificationGrid = async function (data) {
  try {
    let grid = '<ul id="inv-display">';
    if (data.length > 0) {
      data.forEach((vehicle) => {
        grid += "<li>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details"><img src="' +
          vehicle.inv_thumbnail +
          '" alt="Image of ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' on CSE Motors" /></a>';
        grid += '<div class="namePrice">';
        grid += "<hr />";
        grid += "<h2>";
        grid +=
          '<a href="../../inv/detail/' +
          vehicle.inv_id +
          '" title="View ' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          ' details">' +
          vehicle.inv_make +
          " " +
          vehicle.inv_model +
          "</a>";
        grid += "</h2>";
        grid +=
          "<span>$" + new Intl.NumberFormat("en-US").format(vehicle.inv_price) + "</span>";
        grid += "</div>";
        grid += "</li>";
      });
      grid += "</ul>";
    } else {
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
    }
    return grid;
  } catch (error) {
    console.error('Error building classification grid:', error);
    return '<p>Error displaying vehicles.</p>';
  }
};

/* ***************************************
 * Build Vehicle Detail View HTML
 *************************************** */
Util.buildVehicleDetail = function (vehicle) {
  try {
    if (!vehicle) {
      return `<p>Vehicle not found</p>`;
    }

    const price = vehicle.inv_price
      ? new Intl.NumberFormat('en-US').format(vehicle.inv_price)
      : "N/A";
    const mileage = vehicle.inv_miles
      ? new Intl.NumberFormat('en-US').format(vehicle.inv_miles)
      : "N/A";

    return `
      <div class="vehicle-detail">
        <h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <img src="${vehicle.inv_image || '/path/to/default-image.jpg'}" alt="Full-size image of ${vehicle.inv_make} ${vehicle.inv_model}">
        <div class="vehicle-info">
          <p><strong>Price:</strong> $${price}</p>
          <p><strong>Mileage:</strong> ${mileage} miles</p>
          <p><strong>Description:</strong> ${vehicle.inv_description || 'No description available'}</p>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error building vehicle detail:', error);
    return `<p>Error loading vehicle details.</p>`;
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other functions in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => 
  Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
 * Validation Middleware for Classifications
 **************************************** */
Util.classificationValidationMiddleware = (req, res, next) => {
  const { classificationName } = req.body;

  if (!classificationName || !/^[a-zA-Z0-9]+$/.test(classificationName)) {
    req.flash('notice', 'Invalid classification name.');
    return res.redirect('/inv/add-classification');
  }

  next();
};

/* ****************************************
 * Validation Middleware for Inventory
 **************************************** */
Util.inventoryValidationMiddleware = (req, res, next) => {
  const { make, model, year, price, miles, color, image, thumbnail } = req.body;

  if (!make || !model || !year || !price || !miles || !color || !image || !thumbnail) {
    req.flash("notice", "All fields are required.");
    return res.redirect("/inv/add-inventory");
  }

  if (year < 1886 || year > new Date().getFullYear()) {
    req.flash("notice", "Please enter a valid year.");
    return res.redirect("/inv/add-inventory");
  }

  if (!/^\d+(\.\d{1,2})?$/.test(price)) {
    req.flash("notice", "Price must be a valid number.");
    return res.redirect("/inv/add-inventory");
  }

  if (!/^\d+$/.test(miles)) {
    req.flash("notice", "Miles must be a positive number.");
    return res.redirect("/inv/add-inventory");
  }

  next();
};

// Export the utilities object
module.exports = Util;
