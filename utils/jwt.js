const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateAccessToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '15m', // Access Token expires in 15 minutes
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, {  // FIXED THIS LINE
    expiresIn: '7d', // Refresh Token expires in 7 days
  });
};

module.exports = { generateAccessToken, generateRefreshToken };
