const express = require('express');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2/promise'); // Using mysql2/promise to get async/await support
require('dotenv').config();

const app = express();

// Set up the MySQL connection using environment variables
async function initializeDatabase() {
  try {
    const dbMySQL = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      database: process.env.MYSQL_DATABASE,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
    });

    console.log("Connected to MySQL database");

    await dbMySQL.query('USE ' + process.env.MYSQL_DATABASE);

    return dbMySQL;
  } catch (err) {
    console.error("Error connecting to MySQL database: ", err);
    process.exit(1);
  }
}

// Immediately invoked function to connect to the database
(async () => {
  const dbConnection = await initializeDatabase();

  // Make the database connection available through the app context
  app.use((req, res, next) => {
    req.db = dbConnection;
    next();
  });

  app.use(express.json());
  app.use(cookieParser());
  app.use('/api/users', require('./routes/userRoutes'));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();
