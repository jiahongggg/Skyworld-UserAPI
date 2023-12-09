const db = require('./db'); 

// Create a new emergency contact
async function createEmergencyContact(data) {
    // Check if the contact number and email exist in the respective tables
    const contactExists = await db.query(
        'SELECT 1 FROM global_contact WHERE Contact = ?',
        [data.EmergencyContactNo]
    );
    
    const emailExists = await db.query(
        'SELECT 1 FROM global_email WHERE Email = ?',
        [data.EmergencyEmail]
    );
    
    if (!contactExists.length && !emailExists.length) {
        throw new Error('Either contact number or email must exist.');
    }
    
    // Insert new record into customer_emergency table
    const result = await db.query(
        'INSERT INTO customer_emergency (EmergencyName, EmergencyContactNo, EmergencyEmail, Remark, CreatedBy, DateCreated) VALUES (?, ?, ?, ?, ?, NOW())',
        [data.EmergencyName, data.EmergencyContactNo, data.EmergencyEmail, data.Remark, data.CreatedBy]
    );
    return result.insertId;
}

// Retrieve an emergency contact by ID
async function getEmergencyContactById(emergencyId) {
    const result = await db.query(
        'SELECT * FROM customer_emergency WHERE EmergencyID = ? AND Deleted = 0',
        [emergencyId]
    );
    return result[0];
}

// Update an emergency contact
async function updateEmergencyContact(emergencyId, data) {
    await db.query(
        'UPDATE customer_emergency SET EmergencyName = ?, EmergencyContactNo = ?, EmergencyEmail = ?, Remark = ?, ModifiedBy = ?, DateModified = NOW() WHERE EmergencyID = ?',
        [data.EmergencyName, data.EmergencyContactNo, data.EmergencyEmail, data.Remark, data.ModifiedBy, emergencyId]
    );
}

// Soft delete (mark as deleted) an emergency contact
async function deleteEmergencyContact(emergencyId) {
    await db.query(
        'UPDATE customer_emergency SET Deleted = 1 WHERE EmergencyID = ?',
        [emergencyId]
    );
}

module.exports = {
    createEmergencyContact,
    getEmergencyContactById,
    updateEmergencyContact,
    deleteEmergencyContact
};
