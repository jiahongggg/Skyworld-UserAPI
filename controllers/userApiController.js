const userModel = require('../models/userModel');

// Create new user
const createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    await userModel.createUser(username, password, role);
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
  try {
    const { username, password } = req.body;
    await userModel.updateUser(req.params.id, username, password);
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
  createUser,
  getUserDetails,
  updateUser,
  deleteUser,
  listUsers
};
