function errorHandler(err, req, res, next) {
    console.error(err.stack); // Logs the error to the console
  
    res.status(500).render('error', {
      message: 'An error occurred. Please try again later.',
      error: err
    });
  }
  
  module.exports = errorHandler;

  