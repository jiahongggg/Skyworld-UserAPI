const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
require('dotenv').config(); // Load environment variables from .env file

async function login(req, res) {
  const { username, password } = req.body;
  try {
    console.log('Received login request for username:', username);
    
    const user = await userModel.findUserByUsername(username);
    if (!user) {
      console.log('User not found for username:', username);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for username:', username);
      return res.status(401).json({ message: 'Authentication failed' });
    }

    const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Set refresh token in httpOnly cookie
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    console.log('User logged in successfully:', username);
    return res.json({ accessToken });
  } catch (error) {
    console.error('Internal server error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

async function refreshAccessToken(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

  try {
    const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const newAccessToken = jwt.sign({ id: userData.id, role: userData.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log('Access token refreshed successfully for user ID:', userData.id);
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

module.exports = { login, refreshAccessToken, logout };


