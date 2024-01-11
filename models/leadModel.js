const db = require('./db');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const globalAddressModel = require('./globalAddressModel');
const globalContactModel = require('./globalContactModel');
const globalCountryModel = require('./globalCountryModel');
const globalEmailModel = require('./globalEmailModel');

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
    let addressUUID = null;

    try {
        // First, check all foreign key constraints
        const fkConstraintsValid = await checkForeignKeyConstraints(leadData);

        if (!fkConstraintsValid) {
            throw new Error('Foreign key constraint validation failed');
        }

        // Handle global_address
        if (leadData.LeadAddress) {
            addressUUID = leadData.LeadAddress.AddressUUID || uuidv4();

            // Check if the address already exists in the global_address table
            const addressExists = await globalAddressModel.getGlobalAddressByAddressUUID(addressUUID);

            if (!addressExists) {
                // Create the address only if it doesn't exist
                await globalAddressModel.createGlobalAddress(
                    addressUUID,
                    leadData.LeadAddress.Address,
                    leadData.LeadAddress.Postcode,
                    leadData.LeadAddress.City,
                    leadData.LeadAddress.State,
                    leadData.LeadAddress.Country,
                    null,
                    'Developer',
                    new Date(),
                    null,
                    null,
                    0
                );
            }
        }

        // Handle global_contact
        if (leadData.LeadContactNo) {
            // Check if the contact number already exists in the global_contact table
            const contactExists = await globalContactModel.getGlobalContactByContact(leadData.LeadContactNo);

            if (!contactExists) {
                // Create the contact only if it doesn't exist
                await globalContactModel.createGlobalContact(
                    leadData.LeadContactNo,
                    null,
                    'Developer',
                    new Date(),
                    null,
                    null,
                    0
                );
            }
        }

        // Handle global_country
        if (leadData.LeadNationality) {
            // Check if the nationality already exists in the global_country table
            const countryExists = await globalCountryModel.getGlobalCountryByCountry(leadData.LeadNationality);

            if (!countryExists) {
                // Create the nationality only if it doesn't exist
                await globalCountryModel.createGlobalCountry(
                    leadData.LeadNationality,
                    null,
                    'Developer',
                    new Date(),
                    null,
                    null,
                    0
                );
            }
        }

        // Handle global_email
        if (leadData.LeadEmail) {
            // Check if the email already exists in the global_email table
            const emailExists = await globalEmailModel.getGlobalEmailByEmail(leadData.LeadEmail);

            if (!emailExists) {
                // Create the email only if it doesn't exist
                await globalEmailModel.createGlobalEmail(
                    leadData.LeadEmail,
                    null,
                    'Developer',
                    new Date(),
                    null,
                    null,
                    0
                );
            }
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
                LeadInterestType1,
                LeadInterestType2,
                LeadIsExistingBuyer,
                LeadTag,
                Remark,
                CreatedBy,
                DateCreated,
                ModifiedBy,
                DateModified,
                Deleted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
            addressUUID, // Assuming addressUUID corresponds to the address column
            leadData.LeadStatus,
            leadData.LeadDateOfBirth,
            leadData.LeadIncome,
            leadData.LeadMaritalStatus,
            leadData.LeadRace,
            leadData.LeadIsBumi,
            leadData.LeadInterestType1,
            leadData.LeadInterestType2,
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
        // Delete associated records from global_address
        await connection.execute(`DELETE FROM global_address WHERE AddressUUID = (SELECT LeadAddress FROM leads WHERE LeadUUID = ?)`, [leadId]);

        // Delete associated records from global_contact
        await connection.execute(`DELETE FROM global_contact WHERE Contact = (SELECT LeadContactNo FROM leads WHERE LeadUUID = ?)`, [leadId]);

        // Delete associated records from global_email
        await connection.execute(`DELETE FROM global_email WHERE Email = (SELECT LeadEmail FROM leads WHERE LeadUUID = ?)`, [leadId]);

        // Delete the lead
        const [result] = await connection.execute(`DELETE FROM leads WHERE LeadUUID = ?`, [leadId]);

        return result;
    } catch (error) {
        console.error('Error deleting lead:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function listAllLeads(pageNumber = 1, pageSize = 10, filters = {}, sorting = 'LeadName ASC') {
    // Ensure pageNumber and pageSize are integers
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);

    const offset = (pageNumber - 1) * pageSize;
    const connection = await db.connect();

    console.log(`Executing query with pageSize: ${pageSize}, offset: ${offset}`);

    try {
        // Build the WHERE clause for filtering based on the filter object
        let whereClause = '';
        const filterKeys = Object.keys(filters);
        if (filterKeys.length > 0) {
            whereClause = ' WHERE ';
            filterKeys.forEach((key, index) => {
                whereClause += `${key} = ?`;
                if (index < filterKeys.length - 1) {
                    whereClause += ' AND ';
                }
            });
        }

        // Build the ORDER BY clause for sorting based on the sorting parameter
        let orderByClause = '';
        if (sorting) {
            orderByClause = ` ORDER BY ${sorting}`;
        }

        const query = `
            SELECT * FROM leads
            ${whereClause}
            ${orderByClause}
            LIMIT ${pageSize}
            OFFSET ${offset}
        `;

        const [rows] = await connection.execute(query, Object.values(filters));
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
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
