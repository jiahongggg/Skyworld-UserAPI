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

async function createCustomer(customerData) {
    const connection = await db.connect();
    try {
        // First, check all foreign key constraints
        const fkConstraintsValid = await checkForeignKeyConstraints(customerData);
        if (!fkConstraintsValid) {
            throw new Error('Foreign key constraint validation failed');
        }

        // Then, proceed with the INSERT operation
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
            customerData.CustomerAddress,
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
        if (customerData.CustomerNationality && !(await existsInTable('global_country', 'Country', customerData.CustomerNationality))) return false;
        if (customerData.CustomerAddress && !(await existsInTable('global_address', 'AddressUUID', customerData.CustomerAddress))) return false;
        if (customerData.CustomerAddress2 && !(await existsInTable('global_address', 'AddressUUID', customerData.CustomerAddress2))) return false;
        if (customerData.CustomerAddress3 && !(await existsInTable('global_address', 'AddressUUID', customerData.CustomerAddress3))) return false;
        if (customerData.CustomerBeneficiaryID && !(await existsInTable('customer_beneficiary', 'BeneficiaryID', customerData.CustomerBeneficiaryID))) return false;
        if (customerData.CustomerEmergencyContactID && !(await existsInTable('customer_emergency', 'EmergencyID', customerData.CustomerEmergencyContactID))) return false;
        if (customerData.CustomerContactNo && !(await existsInTable('global_contact', 'Contact', customerData.CustomerContactNo))) return false;
        if (customerData.CustomerEmail && !(await existsInTable('global_email', 'Email', customerData.CustomerEmail))) return false;
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
        const [result] = await connection.execute(`DELETE FROM customers WHERE CustomerUUID = ?`, [customerId]);
        return result;
    } catch (error) {
        console.error('Error deleting customer:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function listAllCustomers() {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM customers');
        return rows;
    } finally {
        await connection.end();
    }
}

module.exports = {
    createCustomer,
    getCustomer,
    updateCustomer,
    deleteCustomer,
    listAllCustomers
};
