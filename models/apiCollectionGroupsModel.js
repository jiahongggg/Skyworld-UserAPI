const db = require('./db');

// List all API collection groups
async function listAllGroups() {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute('SELECT * FROM api_collection_groups');
    return rows;
  } finally {
    await connection.end();
  }
}

// Create a new API collection group
async function createGroup(name) {
  const connection = await db.connect();
  try {
    await connection.execute(
      'INSERT INTO api_collection_groups (Name) VALUES (?)',
      [name]
    );
  } finally {
    await connection.end();
  }
}

module.exports = {
  listAllGroups,
  createGroup
};
