const db = require('./db');

// Create a new global contact
async function createGlobalContact(Contact, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        const [result] = await connection.execute(
            'INSERT INTO global_contact (Contact, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Contact, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted]
        );
        return result.insertId;
    } finally {
        await connection.end();
    }
}

// Get a global contact by its Contact
async function getGlobalContactByContact(Contact) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM global_contact WHERE Contact = ?', [Contact]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

// Update a global contact
async function updateGlobalContact(Contact, Remark, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        await connection.execute(
            'UPDATE global_contact SET Remark = ?, ModifiedBy = ?, DateModified = ?, Deleted = ? WHERE Contact = ?',
            [Remark, ModifiedBy, DateModified, Deleted, Contact]
        );
    } finally {
        await connection.end();
    }
}

// Delete a global contact
async function deleteGlobalContact(Contact) {
    const connection = await db.connect();
    try {
        await connection.execute('DELETE FROM global_contact WHERE Contact = ?', [Contact]);
    } finally {
        await connection.end();
    }
}

module.exports = {
    createGlobalContact,
    getGlobalContactByContact,
    updateGlobalContact,
    deleteGlobalContact,
};
