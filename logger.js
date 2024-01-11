const winston = require('winston');
require('winston-mongodb');
require('dotenv').config();

const options = {
  level: 'info',
  db: process.env.MONGODB_URI,
  options: { useUnifiedTopology: true, useNewUrlParser: true },
  collection: 'logs',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  // You can add other options as needed
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.MongoDB(options),
    // Add other transports like Console if needed
  ],
});

module.exports = logger;
