const db = require('./db'); 

// Create a new emergency contact
async function createEmergencyContact(data) {
    const connection = await db.connect();
    try {
        // Check if the contact number and email exist in the respective tables
        const [contactExists] = await connection.execute(
            'SELECT 1 FROM global_contact WHERE Contact = ?',
            [data.EmergencyContactNo]
        );

        const [emailExists] = await connection.execute(
            'SELECT 1 FROM global_email WHERE Email = ?',
            [data.EmergencyEmail]
        );

        if (!contactExists.length && !emailExists.length) {
            throw new Error('Either contact number or email must exist.');
        }

        // Insert new record into customer_emergency table
        const [result] = await connection.execute(
            'INSERT INTO customer_emergency (EmergencyName, EmergencyContactNo, EmergencyEmail, Remark, CreatedBy, DateCreated) VALUES (?, ?, ?, ?, ?, NOW())',
            [data.EmergencyName, data.EmergencyContactNo, data.EmergencyEmail, data.Remark, data.CreatedBy]
        );
        return result.insertId;
    } finally {
        await connection.end();
    }
}

// Retrieve an emergency contact by ID
async function getEmergencyContactById(emergencyId) {
    const connection = await db.connect();
    try {
        const [result] = await connection.execute(
            'SELECT * FROM customer_emergency WHERE EmergencyID = ? AND Deleted = 0',
            [emergencyId]
        );
        return result[0];
    } finally {
        await connection.end();
    }
}

// Update an emergency contact
async function updateEmergencyContact(emergencyId, data) {
    const connection = await db.connect();
    try {
        await connection.execute(
            'UPDATE customer_emergency SET EmergencyName = ?, EmergencyContactNo = ?, EmergencyEmail = ?, Remark = ?, ModifiedBy = ?, DateModified = NOW() WHERE EmergencyID = ?',
            [data.EmergencyName, data.EmergencyContactNo, data.EmergencyEmail, data.Remark, data.ModifiedBy, emergencyId]
        );
    } finally {
        await connection.end();
    }
}

// Soft delete (mark as deleted) an emergency contact
async function deleteEmergencyContact(emergencyId) {
    const connection = await db.connect();
    try {
        await connection.execute(
            'UPDATE customer_emergency SET Deleted = 1 WHERE EmergencyID = ?',
            [emergencyId]
        );
    } finally {
        await connection.end();
    }
}

module.exports = {
    createEmergencyContact,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact
};
