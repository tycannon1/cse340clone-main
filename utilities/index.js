// const invModel = require("../models/inventory-model")
// const Util = {}

// /* ************************
//  * Constructs the nav HTML unordered list
//  ************************** */
// Util.getNav = async function (req, res, next) {
//   let data = await invModel.getClassifications()
//   let list = "<ul>"
//   list += '<li><a href="/" title="Home page">Home</a></li>'
//   data.rows.forEach((row) => {
//     list += "<li>"
//     list +=
//       '<a href="/inv/type/' +
//       row.classification_id +
//       '" title="See our inventory of ' +
//       row.classification_name +
//       ' vehicles">' +
//       row.classification_name +
//       "</a>"
//     list += "</li>"
//   })
//   list += "</ul>"
//   return list
// }

// /* **************************************
// * Build the classification view HTML
// * ************************************ */
// Util.buildClassificationGrid = async function(data){
//     let grid
//     if(data.length > 0){
//       grid = '<ul id="inv-display">'
//       data.forEach(vehicle => { 
//         grid += '<li>'
//         grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
//         + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
//         + 'details"><img src="' + vehicle.inv_thumbnail 
//         +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
//         +' on CSE Motors" /></a>'
//         grid += '<div class="namePrice">'
//         grid += '<hr />'
//         grid += '<h2>'
//         grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
//         + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
//         + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
//         grid += '</h2>'
//         grid += '<span>$' 
//         + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
//         grid += '</div>'
//         grid += '</li>'
//       })
//       grid += '</ul>'
//     } else { 
//       grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
//     }
//     return grid
//   }

//   utilities.buildVehicleDetail = function (vehicle) {
//     return `
//       <div class="vehicle-detail">
//         <h1>${vehicle.year} ${vehicle.make} ${vehicle.model}</h1>
//         <img src="${vehicle.full_image_url}" alt="Full-size image of ${vehicle.make} ${vehicle.model}">
//         <div class="vehicle-info">
//           <p><strong>Price:</strong> $${vehicle.price.toLocaleString()}</p>
//           <p><strong>Mileage:</strong> ${vehicle.mileage.toLocaleString()} miles</p>
//           <p><strong>Description:</strong> ${vehicle.description}</p>
//         </div>
//       </div>
//     `;
//   };

// module.exports = Util

const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
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
};

/* **************************************
 * Build the classification view HTML
 ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
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
};

/* *************************************
 * Build the vehicle detail view HTML
 ************************************** */
Util.buildVehicleDetail = function (vehicle) {
    // Ensure vehicle is defined
    if (!vehicle) {
      return `<p>Vehicle not found</p>`;
    }
  
    const price = vehicle.inv_price ? new Intl.NumberFormat('en-US').format(vehicle.inv_price) : "N/A";
    const mileage = vehicle.inv_miles ? new Intl.NumberFormat('en-US').format(vehicle.inv_miles) : "N/A";
  
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
  };

// Export the utilities object
module.exports = Util;
