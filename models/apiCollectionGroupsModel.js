const db = require('./db');

// List all API collection groups
async function listAllGroups() {
  const connection = await db.connect();

  try {
    const [rows] = await connection.execute('SELECT * FROM api_collection_groups');
    return rows;
  } catch (error) {
    console.error('Error fetching API collection groups:', error);
    throw error;
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

// Get a mapping of ApiGroupID to Name
async function getApiGroupNameMapping() {
  const connection = await db.connect();

  try {
    const results = await connection.execute('SELECT ApiGroupID, Name FROM api_collection_groups');
    const mapping = {};
    results.forEach(row => {
      mapping[row.ApiGroupID] = row.Name;
    });
    return mapping;
  } catch (error) {
    console.error('Error fetching API group names:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

module.exports = {
  listAllGroups,
  createGroup,
  getApiGroupNameMapping
};
