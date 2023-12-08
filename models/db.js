const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection
async function connect() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
  });
}

module.exports = { connect };
