// authMiddleware.js

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { CustomError } = require('./ErrorHandler');
const User = require('../models/UserModel');
require('dotenv').config()

// Secret key for JWT
const secretKey = process.env.SECRET_KEY;

// Generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

// Middleware to authenticate users using JWT
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, secretKey);

    // Fetch the user from the database using the decoded user ID
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new CustomError(401, 'Authentication failed');
    }

    // Attach the user object to the request for further use
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.log(error);
    next(new CustomError(401, 'Authentication failed'));
  }
};

// Middleware to authorize users based on their priority level
const authorizeUser = () => {
  return (req, res, next) => {
    if (req.user) {
      next();
    } else {
      next(new CustomError(403, 'Authorization failed'));
    }
  };
};

module.exports = {
  generateToken,
  authenticateUser,
  authorizeUser,
};
