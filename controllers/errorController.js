// controllers/errorController.js
const triggerError = (req, res, next) => {
    // Intentional error
    const err = new Error("Intentional 500 error for testing");
    err.status = 500;
    next(err);  // Pass the error to the error handling middleware
  };
  
  module.exports = { triggerError };