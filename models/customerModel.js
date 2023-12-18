const db = require('./db');

async function existsInTable(table, column, value) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute(`SELECT COUNT(*) as count FROM ?? WHERE ?? = ?`, [table, column, value]);
        return rows[0].count > 0;
    } finally {
        await connection.end();
    }
}

async function checkForeignKeyConstraints(customerData) {
    const connection = await db.connect();

    // Destructure customer data to get foreign key fields
    const {
        CustomerLeadID, CustomerGender, CustomerNationality, CustomerAddress,
        CustomerAddress2, CustomerAddress3, CustomerBeneficiaryID,
        CustomerEmergencyContactID, CustomerContactNo, CustomerEmail,
        CustomerMaritalStatus, CustomerRace, CustomerPreferredLanguage
    } = customerData;

    try {
        // Check each foreign key constraint
        if (CustomerLeadID && !await existsInTable('leads', 'LeadUUID', CustomerLeadID)) return false;
        if (CustomerGender && !await existsInTable('global_gender', 'Gender', CustomerGender)) return false;
        if (CustomerNationality && !await existsInTable('global_country', 'Country', CustomerNationality)) return false;
        if (CustomerAddress && !await existsInTable('global_address', 'AddressUUID', CustomerAddress)) return false;
        if (CustomerAddress2 && !await existsInTable('global_address', 'AddressUUID', CustomerAddress2)) return false;
        if (CustomerAddress3 && !await existsInTable('global_address', 'AddressUUID', CustomerAddress3)) return false;
        if (CustomerBeneficiaryID && !await existsInTable('customer_beneficiary', 'BeneficiaryID', CustomerBeneficiaryID)) return false;
        if (CustomerEmergencyContactID && !await existsInTable('customer_emergency', 'EmergencyID', CustomerEmergencyContactID)) return false;
        if (CustomerContactNo && !await existsInTable('global_contact', 'Contact', CustomerContactNo)) return false;
        if (CustomerEmail && !await existsInTable('global_email', 'Email', CustomerEmail)) return false;
        if (CustomerMaritalStatus && !await existsInTable('global_marital_status', 'MaritalStatus', CustomerMaritalStatus)) return false;
        if (CustomerRace && !await existsInTable('global_race', 'Race', CustomerRace)) return false;
        if (CustomerPreferredLanguage && !await existsInTable('global_language', 'Language', CustomerPreferredLanguage)) return false;

        // If all checks pass
        return true;
    } catch (error) {
        console.error('Error checking foreign key constraints:', error);
        throw error;
    } finally {
        await connection.end();
    }
}

async function createCustomer(customerData) {
    if (await checkForeignKeyConstraints(customerData)) {
        const connection = await db.connect();
        try {
            const [result] = await connection.execute(`INSERT INTO customers SET ?`, [customerData]);
            return result;
        } finally {
            await connection.end();
        }
    }
    throw new Error('Foreign key constraint check failed');
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
        const [result] = await connection.execute(`UPDATE customers SET ? WHERE CustomerUUID = ?`, [customerData, customerId]);
        return result;
    } finally {
        await connection.end();
    }
}

async function deleteCustomer(customerId) {
    const connection = await db.connect();
    try {
        const [result] = await connection.execute(`DELETE FROM customers WHERE CustomerUUID = ?`, [customerId]);
        return result;
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
