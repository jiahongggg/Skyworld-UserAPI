const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

// Create a new user
async function createUser(username, password, role) {
  const hashedPassword = await bcrypt.hash(password, 8);
  const connection = await db.connect();
  try {
    const [result] = await connection.execute('INSERT INTO users (username, password, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
    const refreshToken = jwt.sign({ id: result.insertId, role: role }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
    await connection.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, result.insertId]);
    return { userId: result.insertId, refreshToken };
  } finally {
    await connection.end();
  }
}

// Find a user by their username
async function findUserByUsername(username) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
  } finally {
    await connection.end();
  }
}

// Update a user's refresh token
async function updateRefreshToken(userId, refreshToken) {
  const connection = await db.connect();
  try {
    await connection.execute('UPDATE users SET refresh_token = ? WHERE id = ?', [refreshToken, userId]);
  } finally {
    await connection.end();
  }
}

// Validate a refresh token
async function validateRefreshToken(refreshToken) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE refresh_token = ?', [refreshToken]);
    return rows.length > 0 ? rows[0] : false;
  } finally {
    await connection.end();
  }
}

// Find a user by their ID
async function findUserById(id) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    return rows[0];
  } finally {
    await connection.end();
  }
}

// Update a user's details
async function updateUser(id, username, password) {
  const hashedPassword = await bcrypt.hash(password, 8);
  const connection = await db.connect();
  try {
    await connection.execute('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, hashedPassword, id]);
  } finally {
    await connection.end();
  }
}

// Delete a user
async function deleteUser(id) {
  const connection = await db.connect();
  try {
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
  } finally {
    await connection.end();
  }
}

// List all users
async function listAllUsers() {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users');
    return rows;
  } finally {
    await connection.end();
  }
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
