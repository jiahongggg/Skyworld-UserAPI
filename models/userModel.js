const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

// Create a new user
async function createUser(userId, username, password, role, createdBy) {
  const hashedPassword = await bcrypt.hash(password, 8);
  const connection = await db.connect();

  try {
    // Check if the username is already taken
    const [existingUser] = await connection.execute('SELECT * FROM users WHERE Username = ?', [username]);
    if (existingUser.length > 0) {
      throw new Error('Username already exists');
    }

    const currentDate = new Date();
    const dateCreated = currentDate.toISOString().slice(0, 19).replace('T', ' '); // Format as "YYYY-MM-DD HH:mm:ss"
    const modifiedBy = createdBy;
    const dateModified = dateCreated;

    const [result] = await connection.execute(
      'INSERT INTO users (UserUUID, Username, Password, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted, Role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, username, hashedPassword, null, createdBy, dateCreated, modifiedBy, dateModified, false, role]
    );

    // Create a JWT token with userId, username, and role
    const tokenPayload = { id: userId, username: username, role: role };
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    await connection.execute('UPDATE users SET RefreshToken = ? WHERE UserUUID = ?', [refreshToken, userId]);
    return { userId, refreshToken };
  } finally {
    await connection.end();
  }
}

// Find a user by their username
async function findUserByUsername(username) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE Username = ?', [username]);
    return rows[0];
  } finally {
    await connection.end();
  }
}

// Update a user's refresh token
async function updateRefreshToken(userId, refreshToken) {
  const connection = await db.connect();
  try {
    await connection.execute('UPDATE users SET RefreshToken = ? WHERE UserUUID = ?', [refreshToken, userId]);
  } finally {
    await connection.end();
  }
}

// Validate a refresh token
async function validateRefreshToken(refreshToken) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE RefreshToken = ?', [refreshToken]);
    return rows.length > 0 ? rows[0] : false;
  } finally {
    await connection.end();
  }
}

// Find a user by their ID
async function findUserById(userId) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM users WHERE UserUUID = ?', [userId]);
    return rows[0];
  } finally {
    await connection.end();
  }
}

// Update a user's details
async function updateUser(userId, updateData) {
  const connection = await db.connect();
  try {
    const fieldUpdates = [];
    const values = [];

    for (const key in updateData) {
      fieldUpdates.push(`${key} = ?`);
      values.push(updateData[key]);
    }

    values.push(userId);

    const updateQuery = `UPDATE users SET ${fieldUpdates.join(', ')} WHERE UserUUID = ?`;

    await connection.execute(updateQuery, values);
  } finally {
    await connection.end();
  }
}

// Delete a user
async function deleteUser(userId) {
  const connection = await db.connect();
  try {
    await connection.execute('DELETE FROM users WHERE UserUUID = ?', [userId]);
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
