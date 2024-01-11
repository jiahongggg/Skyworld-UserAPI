const connectDbAndGetApp = require('./app');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const startServer = async () => {
    try {
        const app = await connectDbAndGetApp();
        app.use(helmet());
        app.use(morgan('tiny'));

        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
