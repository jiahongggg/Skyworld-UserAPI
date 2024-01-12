const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const userApiCollectionGroupModel = require('../models/userApiCollectionGroupModel');
const apiCollectionGroupsModel = require('../models/apiCollectionGroupsModel');
const { validationResult, check } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const NodeCache = require('node-cache'); 
const cache = new NodeCache({ stdTTL: 60 * 5 }); // Cache data for 5 minutes

// Helper function for input validation
const validateUserInput = [
    check('username')
        .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
        .trim() // Remove leading and trailing spaces
        .escape(), // Escapes HTML special characters
    check('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    check('role')
        .isIn(['user', 'admin', 'editor']).withMessage('Invalid role')
        .trim()
        .escape(),
];

// Helper function to refresh the user cache
const refreshUserCache = async () => {
    const users = await userModel.listAllUsers();
    const usersWithSensitiveInfoStripped = users.map(({ password, refresh_token, ...userWithoutSensitiveInfo }) => userWithoutSensitiveInfo);
    cache.set('allUsers', usersWithSensitiveInfoStripped);
};

// Create new user
const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password, role } = req.body;
        const userId = uuidv4(); // Generate a UUID for the user
        const hashedPassword = await bcrypt.hash(password, 10);
        const createdBy = req.user.username; // Get the username of the user who created this user
        await userModel.createUser(userId, username, hashedPassword, role, createdBy);
        console.log(`User created: ${username}`); // Audit log

        // Refresh cache after creating a new user
        await refreshUserCache();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Read user details
const getUserDetails = async (req, res) => {
    try {
        const user = await userModel.findUserById(req.params.id);
        console.log(`User details retrieved: ID ${req.params.id}`); // Audit log
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Exclude sensitive fields from the result
        const { password, refresh_token, ...userWithoutSensitiveInfo } = user;
        res.json(userWithoutSensitiveInfo);
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Update user
const updateUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { username, password, role } = req.body;
        const userId = req.params.id;
        const updateData = {};

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 8);
            updateData.password = hashedPassword;
        }

        if (username) {
            updateData.username = username;
        }

        if (role) {
            updateData.role = role;
        }

        await userModel.updateUser(userId, updateData);
        console.log(`User updated: ID ${userId}`); // Audit log

        // Refresh cache after updating a user
        await refreshUserCache();

        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// Delete user
const deleteUser = async (req, res) => {
    try {
        await userModel.deleteUser(req.params.id);
        console.log(`User deleted: ID ${req.params.id}`); // Audit log

        // Refresh cache after deleting a user
        await refreshUserCache();

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

// List all users
const listUsers = async (req, res) => {
    let cachedUsers = cache.get('allUsers');
    if (!cachedUsers) {
        await refreshUserCache();
        cachedUsers = cache.get('allUsers');
    }
    res.json(cachedUsers);
};

// Function to assign API collection group to a user
const assignApiCollectionGroupToUser = async (req, res) => {
  try {
    const { userUUID, apiCollectionGroupId } = req.body;
    const uuid = uuidv4(); // Generate a UUID for the user_api_collection_group
    await userApiCollectionGroupModel.assignGroupToUser(uuid, userUUID, apiCollectionGroupId);
    res.status(201).json({ message: 'API Collection Group assigned successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to list API collection groups for a user
const listUserApiCollectionGroups = async (req, res) => {
  try {
    const userUUID = req.params.id; // Get the user UUID from the request parameters
    console.log(`test: ${req.params.id}`);
    console.log(`Retrieving API collection groups for user ${userUUID}`);
    const groups = await userApiCollectionGroupModel.listGroupsForUser(userUUID);

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Function to create a new API collection group
const createApiCollectionGroup = async (req, res) => {
  try {
    const { name } = req.body;
    await apiCollectionGroupsModel.createGroup(name);
    res.status(201).json({ message: 'API Collection Group created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createUser: [validateUserInput, createUser],
  getUserDetails,
  updateUser: [validateUserInput, updateUser],
  deleteUser,
  listUsers,
  assignApiCollectionGroupToUser,
  listUserApiCollectionGroups,
  createApiCollectionGroup,
};
