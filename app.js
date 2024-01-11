const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./models/db');

const app = express();

app.use(express.json());
app.use(cookieParser());

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
        console.error("Error connecting to MySQL database: ", err);
        throw err; // This will be caught in server.js
    }
};

module.exports = connectDbAndGetApp;
