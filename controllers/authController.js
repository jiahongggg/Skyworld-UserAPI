const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Rate limiter for login attempts
const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per `window` (here, per 15 minutes)
  message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

async function login(req, res) {
  const { username, password } = req.body;

  if (process.env.NODE_ENV !== 'production') {
    console.log('Received login request for username:', username);
  }

  try {
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isMatch = await bcrypt.compare(password, user.Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const accessToken = jwt.sign(
      { id: user.UUID, username: user.Username, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
      { id: user.UUID, username: user.Username, role: user.Role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return res.json({ accessToken });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.cookies; // Existing refresh token from the cookie

  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate new access token and refresh token
    const newAccessToken = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const newRefreshToken = jwt.sign(
      { id: userData.id, username: userData.username, role: userData.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Update refresh token in the database
    await userModel.updateRefreshToken(userData.id, newRefreshToken);

    // Set the new refresh token in the httpOnly cookie
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
}

async function logout(req, res) {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
}

module.exports = { login, refreshAccessToken, logout, loginRateLimiter };
