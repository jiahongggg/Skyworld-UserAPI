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
        const query = `
            SELECT COUNT(*) as count
            FROM ${mysql.escapeId(table)}
            WHERE ${mysql.escapeId(column)} = ?
        `;

        const [rows] = await connection.execute(query, [value]);
        return rows[0].count > 0;
    } catch (error) {
        console.error('Error in existsInTable:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function createSales(salesData) {
    const connection = await db.connect();
    let addressUUID = null;

    try {
        // First, check all foreign key constraints
        const fkConstraintsValid = await checkForeignKeyConstraints(salesData);

        if (!fkConstraintsValid) {
            throw new Error('Foreign key constraint validation failed');
        }

        // Handle global_address
        if (salesData.AgentAddress) {
            addressUUID = salesData.AgentAddress.AddressUUID || uuidv4();

            // Check if the address already exists in the global_address table
            const addressExists = await globalAddressModel.getGlobalAddressByAddressUUID(addressUUID);

            if (!addressExists) {
                // Create the address only if it doesn't exist
                await globalAddressModel.createGlobalAddress(
                    addressUUID,
                    salesData.AgentAddress.Address,
                    salesData.AgentAddress.Postcode,
                    salesData.AgentAddress.City,
                    salesData.AgentAddress.State,
                    salesData.AgentAddress.Country,
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
        if (salesData.AgentContactNo) {
            // Check if the contact already exists
            const contactExists = await globalContactModel.getGlobalContactByContact(salesData.AgentContactNo);

            if (!contactExists) {
                await globalContactModel.createGlobalContact(
                    salesData.AgentContactNo,
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
        if (salesData.AgentEmail) {
            // Check if the email already exists
            const emailExists = await globalEmailModel.getGlobalEmailByEmail(salesData.AgentEmail);

            if (!emailExists) {
                await globalEmailModel.createGlobalEmail(
                    salesData.AgentEmail,
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
            INSERT INTO sales (
                SalesAgentID,
                AgentName,
                AgentAge,
                AgentGender,
                AgentEmail,
                AgentICPassportNo,
                AgentSalutation,
                AgentNationality,
                AgentContactNo,
                AgentAddress,
                Deleted,
                CreatedBy,
                DateCreated,
                ModifiedBy,
                DateModified
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            salesData.SalesAgentID,
            salesData.AgentName,
            salesData.AgentAge,
            salesData.AgentGender,
            salesData.AgentEmail, 
            salesData.AgentICPassportNo,
            salesData.AgentSalutation,
            salesData.AgentNationality, 
            salesData.AgentContactNo,
            addressUUID,
            salesData.Deleted,
            salesData.CreatedBy,
            salesData.DateCreated,
            salesData.ModifiedBy,
            salesData.DateModified
        ];

        await connection.execute(query, values);
    } catch (error) {
        console.error('Error in createSales:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function checkForeignKeyConstraints(salesData) {
    try {
        // Check each foreign key constraint
        if (salesData.AgentGender && !(await existsInTable('global_gender', 'Gender', salesData.AgentGender))) return false;
        if (salesData.SalesGroupingID && !(await existsInTable('sales_grouping', 'SalesGroupingID', salesData.SalesGroupingID))) return false;
        if (salesData.AssignID && !(await existsInTable('lead_assign', 'AssignID', salesData.AssignID))) return false;
        if (salesData.TaskActID && !(await existsInTable('task_actions', 'TaskActID', salesData.TaskActID))) return false;
        if (salesData.SalesTeamID && !(await existsInTable('sales_team', 'SalesTeamID', salesData.SalesTeamID))) return false;
        if (salesData.SalesTeamProjectsID && !(await existsInTable('sales_team_projects', 'SalesTeamProjectsID', salesData.SalesTeamProjectsID))) return false;
        if (salesData.SalesTypeID && !(await existsInTable('sales_type', 'SalesTypeID', salesData.SalesTypeID))) return false;

        // If all checks pass
        return true;
    } catch (error) {
        console.error('Error checking foreign key constraints:', error);
        throw error;
    }
}

async function getSales(salesAgentID) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute(`SELECT * FROM sales WHERE SalesAgentID = ?`, [salesAgentID]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

async function updateSales(salesAgentID, salesData) {
    const connection = await db.connect();
    try {
        const updateColumns = Object.keys(salesData).map(column => `${column} = ?`).join(', ');
        const updateValues = Object.values(salesData);

        const sql = `UPDATE sales SET ${updateColumns} WHERE SalesAgentID = ?`;
        const [result] = await connection.execute(sql, [...updateValues, salesAgentID]);

        return result;
    } catch (error) {
        console.error('Error updating sales:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function deleteSales(salesAgentID) {
    const connection = await db.connect();
    try {
        // Delete associated records from global_address
        await connection.execute(
            `DELETE FROM global_address WHERE AddressUUID = (SELECT AgentAddress FROM sales WHERE SalesAgentID = ?)`,
            [salesAgentID]
        );

        // Delete associated records from global_contact
        await connection.execute(
            `DELETE FROM global_contact WHERE Contact = (SELECT AgentContactNo FROM sales WHERE SalesAgentID = ?)`,
            [salesAgentID]
        );

        // Delete associated records from global_email
        await connection.execute(
            `DELETE FROM global_email WHERE Email = (SELECT AgentEmail FROM sales WHERE SalesAgentID = ?)`,
            [salesAgentID]
        );

        // Delete the sales record itself
        const [result] = await connection.execute(`DELETE FROM sales WHERE SalesAgentID = ?`, [salesAgentID]);

        return result;
    } catch (error) {
        console.error('Error deleting sales:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function listAllSales(pageNumber = 1, pageSize = 10) {
    // Ensure pageNumber and pageSize are integers
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);
  
    const offset = (pageNumber - 1) * pageSize;
    const connection = await db.connect();

    console.log(`Executing query with pageSize: ${pageSize}, offset: ${offset}`);

    try {
        const query = `SELECT * FROM sales LIMIT ${pageSize} OFFSET ${offset}`;
        const [rows] = await connection.execute(query);
        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createSales,
    getSales,
    updateSales,
    deleteSales,
    listAllSales
};
