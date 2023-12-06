const jwt = require('jsonwebtoken');
require('dotenv').config();

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'Authorization token is required' });

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'bearer') {
    return res.status(401).json({ message: 'Malformed token' });
  }

  const token = parts[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      const message = err.name === 'JsonWebTokenError' ? 'Invalid token' : 'Token expired';
      return res.status(403).json({ message });
    }
    req.user = user;
    next();
  });
}

function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRole };
