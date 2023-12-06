const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const { validationResult, check } = require('express-validator'); 

// Helper function for input validation
const validateUserInput = [
  check('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
  check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  check('role').isIn(['user', 'admin', 'otherRoles']).withMessage('Invalid role'), // Add other roles as needed
];

// Create new user
const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    await userModel.createUser(username, hashedPassword, role);
    console.log(`User created: ${username}`); // Audit log
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Read user details
const getUserDetails = async (req, res) => {
  try {
    const user = await userModel.findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Exclude password from the result
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
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
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    await userModel.updateUser(req.params.id, username, hashedPassword);
    console.log(`User updated: ${username}`); // Audit log
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await userModel.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
  console.log(`User deleted: ID ${req.params.id}`); // Audit log
};

// List all users
const listUsers = async (req, res) => {
  try {
    const users = await userModel.listAllUsers();
    // Exclude password from the results
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    res.json(usersWithoutPasswords);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
};

module.exports = {
  createUser: [validateUserInput, createUser],
  getUserDetails,
  updateUser: [validateUserInput, updateUser],
  deleteUser,
  listUsers
};
