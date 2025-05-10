// Essential imports
const express = require('express');
const dotenv = require('dotenv');
const {connectDB} = require('./config/db');
const cors = require('cors');

// Load environment variables
dotenv.config();

// intialize express app
const app = express();

// connect database
connectDB();

// setup middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Basic route
app.get('/', (req, res) => {
    res.json({message: 'Welcome to Taskify API'}); // welcome endpoint at the root path
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});