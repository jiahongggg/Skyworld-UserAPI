const jwt = require('jsonwebtoken');
const userApiCollectionGroupModel = require('../models/userApiCollectionGroupModel');
const apiCollectionGroupsModel = require('../models/apiCollectionGroupsModel');
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
    console.log('Decoded token:', decoded);
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

const checkApiAccess = (requiredApiGroupName) => {
  return async (req, res, next) => {
    try {
      const userUUID = req.user.UserUUID; 
      const userApiGroups = await userApiCollectionGroupModel.getUserApiGroups(userUUID);
      const groupNameMapping = await apiCollectionGroupsModel.getApiGroupNameMapping();

      // Check if user has access
      const hasAccess = userApiGroups.some(apiGroupId => groupNameMapping[apiGroupId] === requiredApiGroupName);

      if (hasAccess) {
        next();
      } else {
        res.status(403).json({ message: 'Access Denied: You do not have permission to access this API.' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error while checking API access' });
    }
  };
};

module.exports = { verifyToken, checkAccess, checkApiAccess };
