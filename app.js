const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const expressWinston = require('express-winston');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const db = require('./models/db');
const logger = require('./logger');
require('dotenv').config();

// Swagger definition
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SkyWorld API',
      version: '1.0.0',
      description: 'SkyWorld API documentation',
    },
    servers: [
      {
        url: 'http://localhost:3000/', 
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Path to the API docs
};

const openapiSpecification = swaggerJsdoc(options);

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Logging middleware
app.use(
  expressWinston.logger({
    winstonInstance: logger,
    msg: "HTTP {{req.method}} {{req.url}}",
  })
);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));

// Routes
app.get('/', (req, res) => {
  res.status(200).send('Hello World!');
});

// Other routes
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/customers', require('./routes/customerRoutes'));
app.use('/api/v1/leads', require('./routes/leadRoutes'));
app.use('/api/v1/sales', require('./routes/salesRoutes'));

// Database connection middleware
const connectDbAndGetApp = async () => {
  try {
    const dbConnection = await db.connect();
    console.log('Connected to MySQL database');
    app.use((req, res, next) => {
      req.db = dbConnection;
      next();
    });
    return app;
  } catch (err) {
    logger.error('Error connecting to MySQL database: ' + err.message);
    throw err;
  }
};

module.exports = connectDbAndGetApp;
