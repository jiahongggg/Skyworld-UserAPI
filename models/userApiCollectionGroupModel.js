const db = require('./db');

// Assign an API collection group to a user
async function assignGroupToUser(uuid, userUUID, apiCollectionGroupId) {
  const connection = await db.connect();
  try {
    await connection.execute(
      'INSERT INTO user_api_collection_group (UserGroupID, UserUUID, ApiGroupID) VALUES (?, ?, ?)',
      [uuid, userUUID, apiCollectionGroupId]
    );
  } finally {
    await connection.end();
  }
}

// Function to check if a user is in a group
async function isUserInGroup(userUUID, apiCollectionGroupId) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute(
      'SELECT * FROM user_api_collection_group WHERE UserUUID = ? AND ApiGroupID = ?',
      [userUUID, apiCollectionGroupId]
    );
    return rows.length > 0;
  } finally {
    await connection.end();
  }
}

// Function to list API collection groups for a user
async function listGroupsForUser(userUUID) {
  const connection = await db.connect();
  try {
    const [rows] = await connection.execute(
      'SELECT ApiGroupID FROM user_api_collection_group WHERE UserUUID = ?',
      [userUUID]
    );

    const apiGroupIDs = rows.map((row) => row.ApiGroupID);
    console.log('API Group IDs:', apiGroupIDs);

    if (apiGroupIDs.length === 0) {
      console.log('No API access');
      return [];
    }

    const placeholders = Array(apiGroupIDs.length).fill('?').join(', ');
    const groups = await connection.execute(
      `SELECT * FROM api_collection_groups WHERE ApiGroupID IN (${placeholders})`,
      apiGroupIDs
    );

    return groups[0]; // Returning the list of API collection groups
  } finally {
    await connection.end();
  }
}

module.exports = {
  assignGroupToUser,
  isUserInGroup,
  listGroupsForUser,
};
