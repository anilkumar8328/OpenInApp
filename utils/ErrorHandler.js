// errorHandler.js
  
  class CustomError extends Error {
    constructor(statusCode, message) {
      super(message);
      this.statusCode = statusCode;
    }
  }

  const handleErrors = (err, req, res, next) => {
    console.error(err.stack);
    
    // Check if the error is a known type, or return a generic 500 Internal Server Error
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ error: err.message });
    } else {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  };
  
  module.exports = {
    handleErrors,
    CustomError,
  };
  