const mongoose = require('mongoose');

/**
 * Connect to MongoDB database
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        // get MongoDB URI from environment variable or use default one
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/taskify';

        // connect to MongoDB with recommended options
        const conn = await mongoose.connect(mongoUri, {
            // options not needed from mongodb 6+
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // exit with failure code
    }
};

module.exports = connectDB;