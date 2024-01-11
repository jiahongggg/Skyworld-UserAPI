const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressWinston = require('express-winston');
const db = require('./models/db');
const logger = require('./logger');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use(expressWinston.logger({
  winstonInstance: logger,
  msg: "HTTP {{req.method}} {{req.url}} {{req.user.id}}",
}));

// Define a root route for testing
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// Other routes
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/leads', require('./routes/leadRoutes'));
app.use('/api/v1/sales', require('./routes/salesRoutes'));

// Function to connect to the database and return the app
const connectDbAndGetApp = async () => {
  try {
    const dbConnection = await db.connect();
    console.log("Connected to MySQL database");
    app.use((req, res, next) => {
      req.db = dbConnection;
      next();
    });
    return app;
  } catch (err) {
    logger.error("Error connecting to MySQL database: " + err.message);
    throw err;
  }
};

module.exports = connectDbAndGetApp;
