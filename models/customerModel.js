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

async function createCustomer(customerData) {
    const connection = await db.connect();
    let addressUUID = null;
    try {
        // First, check all foreign key constraints
        const fkConstraintsValid = await checkForeignKeyConstraints(customerData);
        if (!fkConstraintsValid) {
            throw new Error('Foreign key constraint validation failed');
        }

        // Handle global_address
        if (customerData.CustomerAddress) {
            addressUUID = customerData.CustomerAddress.AddressUUID || uuidv4();

            // Check if the address already exists in the global_address table
            const addressExists = await globalAddressModel.getGlobalAddressByAddressUUID(addressUUID);

            if (!addressExists) {
                // Create the address only if it doesn't exist
                await globalAddressModel.createGlobalAddress(
                    addressUUID,
                    customerData.CustomerAddress.Address,
                    customerData.CustomerAddress.Postcode,
                    customerData.CustomerAddress.City,
                    customerData.CustomerAddress.State,
                    customerData.CustomerAddress.Country,
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
        if (customerData.CustomerContactNo) {
            // Check if the contact number already exists in the global_contact table
            const contactExists = await globalContactModel.getGlobalContactByContact(customerData.CustomerContactNo);

            if (!contactExists) {
                // Create the contact only if it doesn't exist
                await globalContactModel.createGlobalContact(
                    customerData.CustomerContactNo,
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
        if (customerData.CustomerNationality) {
            // Check if the nationality already exists in the global_country table
            const countryExists = await globalCountryModel.getGlobalCountryByCountry(customerData.CustomerNationality);

            if (!countryExists) {
                // Create the nationality only if it doesn't exist
                await globalCountryModel.createGlobalCountry(
                    customerData.CustomerNationality,
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
        if (customerData.CustomerEmail) {
            // Check if the email already exists in the global_email table
            const emailExists = await globalEmailModel.getGlobalEmailByEmail(customerData.CustomerEmail);

            if (!emailExists) {
                // Create the email only if it doesn't exist
                await globalEmailModel.createGlobalEmail(
                    customerData.CustomerEmail,
                    null,
                    'Developer',
                    new Date(),
                    null,
                    null,
                    0
                );
            }
        }

        // Then, proceed with the INSERT operation in the customers table
        const query = `
            INSERT INTO DW_STUDENT.customers (
                CustomerUUID,
                CustomerLeadID,
                CustomerProfile,
                CustomerName,
                CustomerEmail,
                CustomerContactNo,
                CustomerICPassportNo,
                CustomerGender,
                CustomerSalutation,
                CustomerOccupation,
                CustomerNationality,
                CustomerAddress,
                CustomerAddress2,
                CustomerAddress3,
                CustomerDateOfBirth,
                CustomerIncome,
                CustomerMaritalStatus,
                CustomerRace,
                CustomerIsBumi,
                CustomerIsCorporate,
                CustomerPreferredLanguage,
                CustomerBeneficiaryID,
                CustomerMotherMaidenName,
                CustomerEmergencyContactID,
                Remark,
                CreatedBy,
                DateCreated,
                ModifiedBy,
                DateModified,
                Deleted
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            customerData.CustomerUUID,
            customerData.CustomerLeadID,
            customerData.CustomerProfile,
            customerData.CustomerName,
            customerData.CustomerEmail,
            customerData.CustomerContactNo,
            customerData.CustomerICPassportNo,
            customerData.CustomerGender,
            customerData.CustomerSalutation,
            customerData.CustomerOccupation,
            customerData.CustomerNationality,
            addressUUID,
            customerData.CustomerAddress2,
            customerData.CustomerAddress3,
            customerData.CustomerDateOfBirth,
            customerData.CustomerIncome,
            customerData.CustomerMaritalStatus,
            customerData.CustomerRace,
            customerData.CustomerIsBumi,
            customerData.CustomerIsCorporate,
            customerData.CustomerPreferredLanguage,
            customerData.CustomerBeneficiaryID,
            customerData.CustomerMotherMaidenName,
            customerData.CustomerEmergencyContactID,
            customerData.Remark,
            customerData.CreatedBy,
            customerData.DateCreated,
            customerData.ModifiedBy,
            customerData.DateModified,
            customerData.Deleted
        ];

        await connection.execute(query, values);
    } catch (error) {
        console.error('Error in createCustomer:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function checkForeignKeyConstraints(customerData) {
    try {
        // Check each foreign key constraint
        if (customerData.CustomerLeadID && !(await existsInTable('leads', 'LeadUUID', customerData.CustomerLeadID))) return false;
        if (customerData.CustomerGender && !(await existsInTable('global_gender', 'Gender', customerData.CustomerGender))) return false;
        if (customerData.CustomerAddress2 && !(await existsInTable('global_address', 'AddressUUID', customerData.CustomerAddress2))) return false;
        if (customerData.CustomerAddress3 && !(await existsInTable('global_address', 'AddressUUID', customerData.CustomerAddress3))) return false;
        if (customerData.CustomerBeneficiaryID && !(await existsInTable('customer_beneficiary', 'BeneficiaryID', customerData.CustomerBeneficiaryID))) return false;
        if (customerData.CustomerEmergencyContactID && !(await existsInTable('customer_emergency', 'EmergencyID', customerData.CustomerEmergencyContactID))) return false;
        if (customerData.CustomerMaritalStatus && !(await existsInTable('global_marital_status', 'MaritalStatus', customerData.CustomerMaritalStatus))) return false;
        if (customerData.CustomerRace && !(await existsInTable('global_race', 'Race', customerData.CustomerRace))) return false;
        if (customerData.CustomerPreferredLanguage && !(await existsInTable('global_language', 'Language', customerData.CustomerPreferredLanguage))) return false;

        // If all checks pass
        return true;
    } catch (error) {
        console.error('Error checking foreign key constraints:', error);
        throw error;
    }
}

async function getCustomer(customerId) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute(`SELECT * FROM customers WHERE CustomerUUID = ?`, [customerId]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

async function updateCustomer(customerId, customerData) {
    const connection = await db.connect();
    try {
        const updateColumns = Object.keys(customerData).map(column => `${column} = ?`).join(', ');
        const updateValues = Object.values(customerData);

        const sql = `UPDATE customers SET ${updateColumns} WHERE CustomerUUID = ?`;
        const [result] = await connection.execute(sql, [...updateValues, customerId]);

        return result;
    } catch (error) {
        console.error('Error updating customer:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function deleteCustomer(customerId) {
    const connection = await db.connect();
    try {
        // Delete associated records from global_address
        await connection.execute(`DELETE FROM global_address WHERE AddressUUID = (SELECT CustomerAddress FROM customers WHERE CustomerUUID = ?)`, [customerId]);

        // Delete associated records from global_contact
        await connection.execute(`DELETE FROM global_contact WHERE Contact = (SELECT CustomerContactNo FROM customers WHERE CustomerUUID = ?)`, [customerId]);

        // Delete associated records from global_email
        await connection.execute(`DELETE FROM global_email WHERE Email = (SELECT CustomerEmail FROM customers WHERE CustomerUUID = ?)`, [customerId]);

        // Delete the customer
        const [result] = await connection.execute(`DELETE FROM customers WHERE CustomerUUID = ?`, [customerId]);

        return result;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function listAllCustomers(pageNumber = 1, pageSize = 10, filter = {}, sort = {}) {
    // Ensure pageNumber and pageSize are integers
    pageNumber = parseInt(pageNumber);
    pageSize = parseInt(pageSize);

    const connection = await db.connect();

    console.log(`Executing query with pageSize: ${pageSize}, offset: ${(pageNumber - 1) * pageSize}`);

    try {
        // Build the WHERE clause for filtering based on the filter object
        let whereClause = '';
        const filterKeys = Object.keys(filter);
        if (filterKeys.length > 0) {
            whereClause = 'WHERE ';
            filterKeys.forEach((key, index) => {
                whereClause += `${key} = ?`;
                if (index < filterKeys.length - 1) {
                    whereClause += ' AND ';
                }
            });
        }

        // Build the ORDER BY clause for sorting based on the sort object
        let orderByClause = '';
        const sortKeys = Object.keys(sort);
        if (sortKeys.length > 0) {
            orderByClause = 'ORDER BY ';
            sortKeys.forEach((key, index) => {
                orderByClause += `${key} ${sort[key] === 1 ? 'ASC' : 'DESC'}`;
                if (index < sortKeys.length - 1) {
                    orderByClause += ', ';
                }
            });
        }

        const query = `
            SELECT * FROM customers
            ${whereClause}
            ${orderByClause}
            LIMIT ${pageSize}
            OFFSET ${(pageNumber - 1) * pageSize}
        `;

        const [rows] = await connection.execute(query, Object.values(filter));

        return rows;
    } catch (error) {
        console.error('Error executing query:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    listAllCustomers,
};
