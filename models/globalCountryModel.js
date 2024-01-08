const db = require('./db');

// Create a new global country
async function createGlobalCountry(Country, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        const [result] = await connection.execute(
            'INSERT INTO global_country (Country, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [Country, Remark, CreatedBy, DateCreated, ModifiedBy, DateModified, Deleted]
        );
        return result.insertId;
    } finally {
        await connection.end();
    }
}

// Get a global country by its Country
async function getGlobalCountryByCountry(Country) {
    const connection = await db.connect();
    try {
        const [rows] = await connection.execute('SELECT * FROM global_country WHERE Country = ?', [Country]);
        return rows[0];
    } finally {
        await connection.end();
    }
}

// Update a global country
async function updateGlobalCountry(Country, Remark, ModifiedBy, DateModified, Deleted) {
    const connection = await db.connect();
    try {
        await connection.execute(
            'UPDATE global_country SET Remark = ?, ModifiedBy = ?, DateModified = ?, Deleted = ? WHERE Country = ?',
            [Remark, ModifiedBy, DateModified, Deleted, Country]
        );
    } finally {
        await connection.end();
    }
}

// Delete a global country
async function deleteGlobalCountry(Country) {
    const connection = await db.connect();
    try {
        await connection.execute('DELETE FROM global_country WHERE Country = ?', [Country]);
    } finally {
        await connection.end();
    }
}

module.exports = {
    createGlobalCountry,
    getGlobalCountryByCountry,
    updateGlobalCountry,
    deleteGlobalCountry,
};
