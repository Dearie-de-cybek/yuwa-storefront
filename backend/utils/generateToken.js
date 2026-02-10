const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  // Sign a new token with the User's ID
  // It expires in 30 days (Standard for E-commerce)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;