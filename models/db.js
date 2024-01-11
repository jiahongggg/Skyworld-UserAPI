const mysql = require('mysql2/promise');
require('dotenv').config();

let dbConnection;

async function connect() {
  dbConnection = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
  });

  return dbConnection;
}

async function end() {
  if (dbConnection) {
    await dbConnection.end();
    console.log("MySQL connection closed.");
  } else {
    console.log("No active MySQL connection to close.");
  }
}

module.exports = { connect, end };
