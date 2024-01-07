const db = require('./db');
const mysql = require('mysql2');

async function existsInTable(table, column, value) {
    const connection = await db.connect();
    try {
        const query = `SELECT COUNT(*) as count FROM ${mysql.escapeId(table)} WHERE ${mysql.escapeId(column)} = ?`;

        const [rows] = await connection.execute(query, [value]);
        return rows[0].count > 0;
    } catch (error) {
        console.error('Error in existsInTable:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function createLead(leadData) {
    const connection = await db.connect();
    try {
        // First, check all foreign key constraints
        const fkConstraintsValid = await checkForeignKeyConstraints(leadData);
        if (!fkConstraintsValid) {
            throw new Error('Foreign key constraint validation failed');
        }

        // Then, proceed with the INSERT operation
        const query = `
            INSERT INTO DW_STUDENT.leads (
                LeadUUID,
                LeadName,
                LeadEmail,
                LeadContactNo,
                LeadICPassportNo,
                LeadGender,
                LeadSalutation,
                LeadOccupation,
                LeadNationality,
                LeadAddress,
                LeadStatus,
                LeadDateOfBirth,
                LeadIncome,
                LeadMaritalStatus,
                LeadRace,
                LeadIsBumi,
                LeadInterestedType1,
                LeadInterestedType2,
                LeadIsExistingBuyer,
                LeadTag,
                Remark,
                CreatedBy,
                DateCreated,
                ModifiedBy,
                DateModified,
                Deleted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            leadData.LeadUUID,
            leadData.LeadName,
            leadData.LeadEmail,
            leadData.LeadContactNo,
            leadData.LeadICPassportNo,
            leadData.LeadGender,
            leadData.LeadSalutation,
            leadData.LeadOccupation,
            leadData.LeadNationality,
            leadData.LeadAddress,
            leadData.LeadStatus,
            leadData.LeadDateOfBirth,
            leadData.LeadIncome,
            leadData.LeadMaritalStatus,
            leadData.LeadRace,
            leadData.LeadIsBumi,
            leadData.LeadInterestedType1,
            leadData.LeadInterestedType2,
            leadData.LeadIsExistingBuyer,
            leadData.LeadTag,
            leadData.Remark,
            leadData.CreatedBy,
            leadData.DateCreated,
            leadData.ModifiedBy,
            leadData.DateModified,
            leadData.Deleted
        ];

        await connection.execute(query, values);
    } catch (error) {
        console.error('Error in createLead:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function checkForeignKeyConstraints(leadData) {
    try {
        // Check each foreign key constraint
        if (leadData.LeadStatus && !(await existsInTable('lead_status', 'StatusID', leadData.LeadStatus))) return false;
        if (leadData.LeadGender && !(await existsInTable('global_gender', 'Gender', leadData.LeadGender))) return false;
        if (leadData.LeadNationality && !(await existsInTable('global_country', 'Country', leadData.LeadNationality))) return false;
        if (leadData.LeadAddress && !(await existsInTable('global_address', 'AddressUUID', leadData.LeadAddress))) return false;
        if (leadData.LeadContactNo && !(await existsInTable('global_contact', 'Contact', leadData.LeadContactNo))) return false;
        if (leadData.LeadEmail && !(await existsInTable('global_email', 'Email', leadData.LeadEmail))) return false;
        if (leadData.LeadMaritalStatus && !(await existsInTable('global_marital_status', 'MaritalStatus', leadData.LeadMaritalStatus))) return false;
        if (leadData.LeadRace && !(await existsInTable('global_race', 'Race', leadData.LeadRace))) return false;
        if (leadData.LeadTag && !(await existsInTable('lead_taglist', 'TagID', leadData.LeadTag))) return false;

        // If all checks pass
        return true;
    } catch (error) {
        console.error('Error checking foreign key constraints:', error);
        throw error;
    }
}

async function getLead(leadId) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute(`SELECT * FROM leads WHERE LeadUUID = ?`, [leadId]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

async function updateLead(leadId, leadData) {
    const connection = await db.connect();
    try {
        const updateColumns = Object.keys(leadData).map(column => `${column} = ?`).join(', ');
        const updateValues = Object.values(leadData);

        const sql = `UPDATE leads SET ${updateColumns} WHERE LeadUUID = ?`;
        const [result] = await connection.execute(sql, [...updateValues, leadId]);

        return result;
    } catch (error) {
        console.error('Error updating lead:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function deleteLead(leadId) {
    const connection = await db.connect();
    try {
        const [result] = await connection.execute(`DELETE FROM leads WHERE LeadUUID = ?`, [leadId]);
        return result;
    } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function listAllLeads() {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM leads');
        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createLead,
    getLead,
    updateLead,
    deleteLead,
    listAllLeads
};
