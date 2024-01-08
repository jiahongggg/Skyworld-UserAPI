const db = require('./db');
const globalCountryModel = require('./globalCountryModel');

// Create a new global address
async function createGlobalAddress(AddressUUID, Address, Postcode, City, State, Country, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        // Check if the specified country exists in the global_country table
        let country = await globalCountryModel.getGlobalCountryByCountry(Country);

        if (!country) {
            // Country not found, create a new row in global_country
            country = await globalCountryModel.createGlobalCountry(Country, null, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted);
        }

        const [result] = await connection.execute(
            'INSERT INTO global_address (AddressUUID, Address, Postcode, City, State, Country, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [AddressUUID, Address, Postcode, City, State, country.Country, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted]
        );
        return result.insertId;
    } finally {
        await connection.end();
    }
}

// Get a global address by its AddressUUID
async function getGlobalAddressByAddressUUID(AddressUUID) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM global_address WHERE AddressUUID = ?', [AddressUUID]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

// Update a global address
async function updateGlobalAddress(AddressUUID, Address, Postcode, City, State, Country, Remark, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        // Check if the specified country exists in the global_country table
        let country = await globalCountryModel.getGlobalCountryByCountry(Country);

        if (!country) {
            // Country not found, create a new row in global_country
            country = await globalCountryModel.createGlobalCountry(Country, null, ModifiedBy, DateModified, ModifiedBy, DateModified, Deleted);
        }

        await connection.execute(
            'UPDATE global_address SET Address = ?, Postcode = ?, City = ?, State = ?, Country = ?, Remark = ?, ModifiedBy = ?, DateModified = ?, Deleted = ? WHERE AddressUUID = ?',
            [Address, Postcode, City, State, country.Country, Remark, ModifiedBy, DateModified, Deleted, AddressUUID]
        );
    } finally {
        await connection.end();
    }
}

// Delete a global address
async function deleteGlobalAddress(AddressUUID) {
    const connection = await db.connect();
    try {
        await connection.execute('DELETE FROM global_address WHERE AddressUUID = ?', [AddressUUID]);
    } finally {
        await connection.end();
    }
}

module.exports = {
    createGlobalAddress,
    getGlobalAddressByAddressUUID,
    updateGlobalAddress,
    deleteGlobalAddress,
};
