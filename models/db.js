const mysql = require('mysql2/promise');
require('dotenv').config();

let connection = null;

async function connect() {
  if (!connection) {
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });
  }
  return connection;
}

async function disconnect() {
  if (connection) {
    await connection.end();
    connection = null;
  }
}

module.exports = { connect, disconnect };
