const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet'); 
const db = require('./models/db');
require('dotenv').config();

const app = express();

app.use(helmet());

(async () => {
  try {
    const dbConnection = await db.connect();
    console.log("Connected to MySQL database");

    app.use((req, res, next) => {
      req.db = dbConnection;
      next();
    });

    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/v1/users', require('./routes/userRoutes'));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MySQL database: ", err);
    process.exit(1);
  }
})();
