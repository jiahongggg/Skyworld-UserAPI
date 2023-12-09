const mysql = require('mysql2/promise');
require('dotenv').config();

let connection;

async function connect() {
    const config = {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        port: process.env.MYSQL_PORT || 3306
    };

    connection = await mysql.createConnection(config);
}

async function disconnect() {
    if (connection) {
        await connection.end();
        connection = null;
    }
}

module.exports = { connect, disconnect };
