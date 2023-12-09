const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const checkAccess = (allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (allowedRoles.includes(role)) {
      next();
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }
  };
};

module.exports = { verifyToken, checkAccess };
