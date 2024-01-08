const db = require('./db');

// Create a new global email
async function createGlobalEmail(Email, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        const [result] = await connection.execute(
            'INSERT INTO global_email (Email, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Email, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted]
        );
        return result.insertId;
    } finally {
        await connection.end();
    }
}

// Get a global email by its Email
async function getGlobalEmailByEmail(Email) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM global_email WHERE Email = ?', [Email]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

// Update a global email
async function updateGlobalEmail(Email, Remark, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        await connection.execute(
            'UPDATE global_email SET Remark = ?, ModifiedBy = ?, DateModified = ?, Deleted = ? WHERE Email = ?',
            [Remark, ModifiedBy, DateModified, Deleted, Email]
        );
    } finally {
        await connection.end();
    }
}

// Delete a global email
async function deleteGlobalEmail(Email) {
    const connection = await db.connect();
    try {
        await connection.execute('DELETE FROM global_email WHERE Email = ?', [Email]);
    } finally {
        await connection.end();
    }
}

module.exports = {
    createGlobalEmail,
    getGlobalEmailByEmail,
    updateGlobalEmail,
    deleteGlobalEmail,
};
