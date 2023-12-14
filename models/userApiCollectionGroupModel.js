const db = require('./db');

// Assign an API collection group to a user
async function assignGroupToUser(uuid, userUUID, apiCollectionGroupId) {
  const connection = await db.connect();
  try {
    await connection.execute(
      'INSERT INTO user_api_collection_group (UUID, UserUUID, ApiCollectionGroupId) VALUES (?, ?, ?)',
      [uuid, userUUID, apiCollectionGroupId]
    );
  } finally {
    await connection.end();
  }
}

module.exports = {
  assignGroupToUser
};
