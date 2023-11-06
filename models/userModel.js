const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

// Create a new user
async function createUser(username, password, role) {
  const hashedPassword = await bcrypt.hash(password, 8);
  const connection = await db.connect();
  const [result] = await connection.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
  
  // Generate a refresh token
  const refreshToken = jwt.sign({ id: result.insertId, role: role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  // Store the refresh token with the user record
  await connection.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, result.insertId]);
  await connection.end();

  return { userId: result.insertId, refreshToken };
}

// Find a user by their username
async function findUserByUsername(username) {
  const connection = await db.connect();
  const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
  await connection.end();
  return rows[0];
}

// Update a user's refresh token
async function updateRefreshToken(userId, refreshToken) {
  const connection = await db.connect();
  await connection.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
  await connection.end();
}

// Validate a refresh token
async function validateRefreshToken(refreshToken) {
  const connection = await db.connect();
  const [rows] = await connection.execute('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
  await connection.end();

  if (rows.length === 0) {
    return false;
  }
  return rows[0];
}

// Find a user by their ID
async function findUserById(id) {
  const connection = await db.connect();
  const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
  await connection.end();
  return rows[0];
}

// Update a user's details
async function updateUser(id, username, password) {
  const hashedPassword = await bcrypt.hash(password, 8);
  const connection = await db.connect();
  await connection.execute('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, id]);
  await connection.end();
}

// Delete a user
async function deleteUser(id) {
  const connection = await db.connect();
  await connection.execute('DELETE FROM users WHERE id = ?', [id]);
  await connection.end();
}

// List all users
async function listAllUsers() {
  const connection = await db.connect();
  const [rows] = await connection.execute('SELECT * FROM users');
  await connection.end();
  return rows;
}

module.exports = {
  createUser,
  findUserByUsername,
  updateRefreshToken,
  validateRefreshToken,
  findUserById,
  updateUser,
  deleteUser,
  listAllUsers
};
